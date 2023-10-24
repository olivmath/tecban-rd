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
import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';
import { AssetID } from 'src/wallet/types/wallet.types';

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
        const { description, amount } = dto as RealDigitalMintDTO;
        // const parfinDTO = {} as Omit<ParfinContractInteractDTO, 'blockchainId'>;
        const parfinDTO = new ParfinContractInteractDTO()
        const { blockchainId, ...partialDTO } = parfinDTO;

        partialDTO.description = description;
        partialDTO.source = {
            assetId: AssetID.realDigital
        }
        console.log('>>> Partial DTO source:', partialDTO.source.assetId)

        try {
            // 1 - Pegar o endereço do contrato `Real Digital`
            parfinDTO.metadata.contractAddress =
                await this.contractHelper.getContractAddress('STR');
        } catch (error) {
            this.logger.error(error);
            throw new Error('Erro ao buscar o endereço do contrato: STR');
        }

        // 2 - Codificar a chamada do contrato `Real Digital`
        parfinDTO.metadata.data = this.str.requestToMint(amount)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint write
            const parfinSendRes = await this.parfinService.smartContractSend(
                partialDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.MINT,
                asset: AssetTypes.RD,
                ...parfinDTO,
            };
            try {
                // 4 - Salvar a transação no banco
                const { id: dbTransactionId } =
                    await this.transactionService.create(transactionData);

                try {
                    // 5 - Assinar a transação e inseri-la na blockchain
                    return await this.transactionService.transactionSignAndPush(
                        transactionId,
                        dbTransactionId,
                    );
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        `Erro ao tentar assinar a transação ${transactionId} de emissão de Real Digital na Parfin`,
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao tentar salvar a transação ${transactionId} de emissão de Real Digital no banco`,
                );
            }
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                'Erro durante a execução do processo de emissão de Real Digital',
            );
        }
    }

    async burn(dto: RealDigitalBurnDTO): Promise<any> {
        const { amount } = dto as RealDigitalBurnDTO;
        const parfinDTO = dto as Omit<
            RealDigitalBurnDTO,
            'amount' | 'blockchainId'
        >;
        try {
            // 1 - Pegar o endereço do contrato `Real Digital`
            parfinDTO.metadata.contractAddress =
                await this.contractHelper.getContractAddress('STR');
        } catch (error) {
            this.logger.error(error);
            throw new Error('Erro ao buscar o endereço do contrato: STR');
        }

        // 2 - Codificar a chamada do contrato `Real Digital`
        parfinDTO.metadata.data = this.str.requestToBurn(amount)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint send/write
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.BURN,
                asset: AssetTypes.RD,
                ...parfinDTO,
            };
            try {
                // 4 - Salvar a transação no banco
                const { id: dbTransactionId } =
                    await this.transactionService.create(transactionData);

                try {
                    // 5 - Assinar a transação e inseri-la na blockchain
                    return await this.transactionService.transactionSignAndPush(
                        transactionId,
                        dbTransactionId,
                    );
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        `Erro ao tentar assinar a transação ${transactionId} de queima de Real Digital na Parfin`,
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao tentar salvar a transação ${transactionId} de queima no banco`,
                );
            }
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                'Erro durante a execução do processo de queima de Real Digital',
            );
        }
    }

    async transfer(dto: RealDigitalTransferDTO): Promise<any> {
        const { cnpj, amount } = dto as RealDigitalTransferDTO;
        const parfinCallDTO = dto as Pick<
            RealDigitalTransferDTO,
            'metadata' | 'blockchainId'
        >;

        try {
            // 1 - Pegar o endereço do contrato `Real Digital Default Account`
            parfinCallDTO.metadata.contractAddress =
                await this.contractHelper.getContractAddress(
                    'RealDigitalDefaultAccount',
                );
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                'Erro ao buscar o endereço do contrato: RealDigitalDefaultAccount',
            );
        }

        // 2 - Codificar a chamada do contrato `Real Digital Default Account`
        parfinCallDTO.metadata.data =
            this.realDigitalDefaultAccount.defaultAccount(cnpj)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint call/read para obter o endereço de destino
            const parfinCallRes = await this.parfinService.smartContractCall(
                parfinCallDTO,
            );
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;

            // 3.1 - Recuperar o CNPJ das informações consultadas no contrato
            const receiverAddress =
                this.realDigitalDefaultAccount.defaultAccount({
                    returned: data,
                })[0] as string;

            // 4 - Executar a transferência
            const parfinSendDTO = dto as Omit<
                RealDigitalTransferDTO,
                'cnpj' | 'amount' | 'blockchainId'
            >;

            try {
                // try aqui
                // 5 - Pegar o endereço do contrato `Real Digital`
                parfinSendDTO.metadata.contractAddress =
                    await this.contractHelper.getContractAddress('RealDigital');

                // 6 - Codificar a chamada do contrato `Real Digital`
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

                    const transactionData = {
                        parfinTransactionId: transactionId,
                        operation: TransactionOperations.TRANSFER,
                        asset: AssetTypes.RD,
                        ...parfinSendDTO,
                    };
                    try {
                        // 8 - Salvar a transação no banco
                        const { id: dbTransactionId } =
                            await this.transactionService.create(
                                transactionData,
                            );

                        try {
                            // 9 - Assinar transação e inserir na blockchain
                            return await this.transactionService.transactionSignAndPush(
                                transactionId,
                                dbTransactionId,
                            );
                        } catch (error) {
                            this.logger.error(error);
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de transferência de Real Digital na Parfin`,
                            );
                        }
                    } catch (error) {
                        this.logger.error(error);
                        throw new Error(
                            `Erro ao tentar salvar transação ${transactionId} de transferência de Real Digital no banco`,
                        );
                    }
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        'Erro durante a interação com o contrato para executar a transferência de Real Digital',
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao tentar buscar carteira do destinatário com documento: ${cnpj}`,
                );
            }
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                'Erro durante a execução do processo de transferência de Real Digital',
            );
        }
    }
}
