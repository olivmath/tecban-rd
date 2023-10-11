import { TransactionsService } from 'src/transactions/transactions.service';
import ParfinContractWrapper from 'src/utils/contract/contract-wrapper';
import { ContractHelper } from 'src/helpers/contract/contract';
import { ParfinService } from 'src/parfin/parfin.service';
import { IServiceDTO } from 'src/interfaces/service';
import { Injectable } from '@nestjs/common';
import {
    AssetTypes,
    TransactionOperations,
} from 'src/transactions/types/transactions.types';
import {
    RealDigitalMintDTO,
    RealDigitalBurnDTO,
    RealDigitalTransferDTO,
} from './dtos/real-digital.dto';
import {
    ParfinContractCallSuccessRes,
    ParfinSuccessRes,
} from 'src/res/parfin.responses';

@Injectable()
export class RealDigitalService {
    realDigitalDefaultAccount: ParfinContractWrapper;
    realDigital: ParfinContractWrapper;
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly contractHelper: ContractHelper,
        private readonly parfinService: ParfinService,
    ) {
        this.realDigital = this.contractHelper.getContract('RealDigital');
        this.realDigitalDefaultAccount = this.contractHelper.getContract(
            'RealDigitalDefaultAccount',
        );
    }

    async mint({ dto }: IServiceDTO): Promise<any> {
        const { to, amount } = dto as RealDigitalMintDTO;
        const parfinDTO = dto as Omit<
            RealDigitalMintDTO,
            'amount' | 'blockchainId' | 'to'
        >;

        // 1 - pegar endereço do contrato `Real Digital`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.addressDiscovery('RealDigital');
        // 2 - codificar a chamada do contrato `Real Digital`
        parfinDTO.metadata.data = this.realDigital.mint(to, amount)[0];

        // 3 - Interagir com o contrato usando o endpoint send/write
        try {
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            if (transactionId) {
                try {
                    // 4 - Salvar transação no banco
                    const transactionData = {
                        parfinTransactionId: transactionId,
                        operation: TransactionOperations.MINT,
                        asset: AssetTypes.RD,
                        ...parfinDTO,
                    };

                    const { id: dbTransactionId } =
                        await this.transactionService.create(transactionData);

                    if (dbTransactionId) {
                        try {
                            // 5 - Assinar transação e inserir na blockchain
                            return await this.transactionService.transactionSignAndPush(
                                transactionId,
                                dbTransactionId,
                            );
                        } catch (error) {
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de emissão de Real Digital / Erro: ${error}`,
                            );
                        }
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de emissão de Real Digital no banco / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar criar transação de emissão de Real Digital / Erro: ${error}`,
            );
        }
    }

    async burn({ dto }: IServiceDTO): Promise<any> {
        const { amount } = dto as RealDigitalBurnDTO;
        const parfinDTO = dto as Omit<
            RealDigitalBurnDTO,
            'amount' | 'blockchainId'
        >;

        // 1 - pegar endereço do contrato `Real Digital`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.addressDiscovery('RealDigital');
        // 2 - codificar a chamada do contrato `Real Digital`
        parfinDTO.metadata.data = this.realDigital.burn(amount)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint send/write
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            if (transactionId) {
                try {
                    // 4 - Salvar transação no banco
                    const transactionData = {
                        parfinTransactionId: transactionId,
                        operation: TransactionOperations.BURN,
                        asset: AssetTypes.RD,
                        ...parfinDTO,
                    };
                    const { id: dbTransactionId } =
                        await this.transactionService.create(transactionData);

                    if (dbTransactionId) {
                        try {
                            // 5 - Assinar transação e inserir na blockchain
                            return await this.transactionService.transactionSignAndPush(
                                transactionId,
                                dbTransactionId,
                            );
                        } catch (error) {
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de queima de Real Digital / Erro: ${error}`,
                            );
                        }
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de queima no banco / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar criar transação de queima de Real Digital / Erro: ${error}`,
            );
        }
    }

    async transfer({ dto }: IServiceDTO): Promise<any> {
        const { cnpj, amount } = dto as RealDigitalTransferDTO;
        const parfinDTO = dto as Omit<
            RealDigitalTransferDTO,
            'blockchainId' | 'amount' | 'cnpj'
        >;

        // 1 - pegar endereço do contrato `Real Digital Default Account`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.addressDiscovery(
                'RealDigitalDefaultAccount',
            );
        // 2 - codificar a chamada do contrato `Real Digital Default Account`
        parfinDTO.metadata.data =
            this.realDigitalDefaultAccount.defaultAccount(cnpj)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint call/read para obter o endereço de destino
            const parfinCallRes = (await this.parfinService.smartContractCall(
                parfinDTO,
            )) as ParfinContractCallSuccessRes;
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;

            if (data) {
                // 3.1 - Recuperar o CNPJ das informações consultdas no contrato
                const receiverAddress =
                    this.realDigitalDefaultAccount.defaultAccount({
                        returned: data,
                    })[0];

                // 4 - Executar a transferência
                const parfinSendDTO = dto as Omit<
                    RealDigitalTransferDTO,
                    'cnpj' | 'amount' | 'blockchainId'
                >;

                // 5 - pegar endereço do contrato `Real Digital`
                parfinSendDTO.metadata.contractAddress =
                    await this.contractHelper.addressDiscovery('RealDigital');
                // 6 - codificar a chamada do contrato `Real Digital`
                parfinSendDTO.metadata.data = this.realDigital.transfer(
                    receiverAddress,
                    amount,
                )[0];

                try {
                    // 7 - Interagir com o contrato usando o endpoint send/write para executar a transferência
                    const parfinSendRes =
                        await this.parfinService.smartContractSend(
                            parfinSendDTO,
                        );
                    const { id: transactionId } =
                        parfinSendRes as ParfinSuccessRes;

                    if (transactionId) {
                        try {
                            // 8 - Salvar transação no banco
                            const transactionData = {
                                parfinTransactionId: transactionId,
                                operation: TransactionOperations.TRANSFER,
                                asset: AssetTypes.RD,
                                ...parfinSendDTO,
                            };
                            const { id: dbTransactionId } =
                                await this.transactionService.create(
                                    transactionData,
                                );

                            if (dbTransactionId) {
                                try {
                                    // 9 - Assinar transação e inserir na blockchain
                                    return await this.transactionService.transactionSignAndPush(
                                        transactionId,
                                        dbTransactionId,
                                    );
                                } catch (error) {
                                    throw new Error(
                                        `Erro ao tentar assinar transação ${transactionId} de transferência de Real Digital / Erro: ${error}`,
                                    );
                                }
                            }
                        } catch (error) {
                            throw new Error(
                                `Erro ao tentar salvar transação ${transactionId} de transferência de Real Digital no banco / Erro: ${error}`,
                            );
                        }
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar criar transação de transferência de Real Digital / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar buscar carteira do destinatário com documento: ${cnpj} / Erro: ${error}`,
            );
        }
    }
}
