import { TransactionsService } from 'src/transactions/transactions.service';
import { ContractHelperService } from 'src/helpers/Contract/contract.service';
import ContractWrapper from 'src/utils/contract/contract-wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
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
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class RealDigitalService {
    str: ContractWrapper;
    realDigitalDefaultAccount: ContractWrapper;
    realDigital: ContractWrapper;
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly contractHelper: ContractHelperService,
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService,
    ) {
        this.str = this.contractHelper.getContractMethods('STR');
        this.realDigital =
            this.contractHelper.getContractMethods('RealDigital');
        this.realDigitalDefaultAccount = this.contractHelper.getContractMethods(
            'RealDigitalDefaultAccount',
        );
        this.logger.setContext('RealDigitalService');
    }

    async mint(dto: RealDigitalMintDTO): Promise<any> {
        const { amount } = dto as RealDigitalMintDTO;
        const parfinDTO = dto as Omit<
            RealDigitalMintDTO,
            'amount' | 'blockchainId'
        >;

        // 1 - pegar endereço do contrato `Real Digital`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.getContractAddress('STR');
        // 2 - codificar a chamada do contrato `Real Digital`
        parfinDTO.metadata.data = this.str.requestToMint(amount)[0];

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
                            this.logger.error(error);
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de emissão de Real Digital`,
                            );
                        }
                    }
                } catch (error) {
                    this.logger.error(error);

                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de emissão de Real Digital no banco`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);

            throw new Error(
                `Erro ao tentar criar transação de emissão de Real Digital`,
            );
        }
    }

    async burn(dto: RealDigitalBurnDTO): Promise<any> {
        const { amount } = dto as RealDigitalBurnDTO;
        const parfinDTO = dto as Omit<
            RealDigitalBurnDTO,
            'amount' | 'blockchainId'
        >;

        // 1 - pegar endereço do contrato `Real Digital`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.getContractAddress('STR');
        // 2 - codificar a chamada do contrato `Real Digital`
        parfinDTO.metadata.data = this.str.requestToBurn(amount)[0];

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
                            this.logger.error(error);

                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de queima de Real Digital`,
                            );
                        }
                    }
                } catch (error) {
                    this.logger.error(error);

                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de queima no banco`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);

            throw new Error(
                `Erro ao tentar criar transação de queima de Real Digital`,
            );
        }
    }

    async transfer(dto: RealDigitalTransferDTO): Promise<any> {
        const { cnpj, amount } = dto as RealDigitalTransferDTO;
        const parfinCallDTO = dto as Pick<
            RealDigitalTransferDTO,
            'metadata' | 'blockchainId'
        >;

        // 1 - pegar endereço do contrato `Real Digital Default Account`
        parfinCallDTO.metadata.contractAddress =
            await this.contractHelper.getContractAddress(
                'RealDigitalDefaultAccount',
            );
        // 2 - codificar a chamada do contrato `Real Digital Default Account`
        parfinCallDTO.metadata.data =
            this.realDigitalDefaultAccount.defaultAccount(cnpj)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint call/read para obter o endereço de destino
            const parfinCallRes = await this.parfinService.smartContractCall(
                parfinCallDTO,
            );
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;

            if (data) {
                // 3.1 - Recuperar o CNPJ das informações consultdas no contrato
                const receiverAddress =
                    this.realDigitalDefaultAccount.defaultAccount({
                        returned: data,
                    })[0] as string;

                // 4 - Executar a transferência
                const parfinSendDTO = dto as Omit<
                    RealDigitalTransferDTO,
                    'cnpj' | 'amount' | 'blockchainId'
                >;

                // 5 - pegar endereço do contrato `Real Digital`
                parfinSendDTO.metadata.contractAddress =
                    await this.contractHelper.getContractAddress('RealDigital');
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
                                    this.logger.error(error);

                                    throw new Error(
                                        `Erro ao tentar assinar transação ${transactionId} de transferência de Real Digital`,
                                    );
                                }
                            }
                        } catch (error) {
                            this.logger.error(error);

                            throw new Error(
                                `Erro ao tentar salvar transação ${transactionId} de transferência de Real Digital no banco`,
                            );
                        }
                    }
                } catch (error) {
                    this.logger.error(error);

                    throw new Error(
                        `Erro ao tentar criar transação de transferência de Real Digital`,
                    );
                }
            }
        } catch (error) {
            this.logger.error(error);

            throw new Error(
                `Erro ao tentar buscar carteira do destinatário com documento: ${cnpj}`,
            );
        }
    }
}
