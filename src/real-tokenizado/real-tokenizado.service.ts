import { TransactionsService } from 'src/transactions/transactions.service';
import { ContractService } from 'src/helpers/Contract/contract.service';
import ContractWrapper from 'src/utils/contract/contract-wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
    AssetTypes,
    TransactionOperations,
} from 'src/transactions/types/transactions.types';
import {
    RealTokenizadoMintDTO,
    RealTokenizadoBurnDTO,
    RealTokenizadoInternalTransferDTO,
} from './dtos/real-tokenizado.dto';
import {
    ParfinContractCallSuccessRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';

@Injectable()
export class RealTokenizadoService {
    keyDictionary: ContractWrapper;
    realTokenizado: ContractWrapper;
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly contractHelper: ContractService,
        private readonly parfinService: ParfinService,
    ) {
        this.realTokenizado = this.contractHelper.getContractMethods('RealTokenizado');
        this.keyDictionary = this.contractHelper.getContractMethods('KeyDictionary');
    }

    async mint(dto: RealTokenizadoMintDTO): Promise<any> {
        const { to, amount } = dto as RealTokenizadoMintDTO;
        const parfinDTO = dto as Omit<
            RealTokenizadoMintDTO,
            'to' | 'amount' | 'blockchainId'
        >;

        // 1 - pegar endereço do contrato `Real Tokenizado`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.getContractAddress('RealTokenizado');
        // 2 - codificar a chamada do contrato `Real Tokenizado`
        parfinDTO.metadata.data = this.realTokenizado.mint(to, amount)[0];

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
                                `Erro ao tentar assinar transação ${transactionId} de emissão de Real Tokenizado / Erro: ${error}`,
                            );
                        }
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de emissão de Real Tokenizado no banco / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar criar transação de emissão de Real Tokenizado / Erro: ${error}`,
            );
        }
    }

    async burn(dto: RealTokenizadoBurnDTO): Promise<any> {
        const { amount } = dto as RealTokenizadoBurnDTO;
        const parfinDTO = dto as Omit<
            RealTokenizadoBurnDTO,
            'amount' | 'blockchainId'
        >;

        // 1 - pegar endereço do contrato `Real Tokenizado`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.getContractAddress('RealTokenizado');
        // 2 - codificar a chamada do contrato `Real Tokenizado`
        parfinDTO.metadata.data = this.realTokenizado.burn(amount)[0];

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

                    try {
                        // 5 - Assinar transação e inserir na blockchain
                        return await this.transactionService.transactionSignAndPush(
                            transactionId,
                            dbTransactionId,
                        );
                    } catch (error) {
                        throw new Error(
                            `Erro ao tentar assinar transação ${transactionId} de queima de Real Tokenizado / Erro: ${error}`,
                        );
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de queima de Real Tokenizado no banco / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar criar transação de queima de Real Tokenizado / Erro: ${error}`,
            );
        }
    }

    async internalTransfer(dto: RealTokenizadoInternalTransferDTO): Promise<any> {
        const { key, amount } = dto as RealTokenizadoInternalTransferDTO;
        const parfinDTO = dto as Omit<
            RealTokenizadoInternalTransferDTO,
            'blockchainId' | 'key' | 'amount'
        >;

        // 1 - pegar endereço do contrato `Key Dictionary`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.getContractAddress('KeyDictionary');
        // 2 - codificar a chamada do contrato `Key Dictionary`
        parfinDTO.metadata.data = this.keyDictionary.getWallet(key)[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint call/read
            const parfinCallRes = await this.parfinService.smartContractCall(
                parfinDTO,
            );
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;

            if (data) {
                // 3.1 - Recuperar o address das informações consultadas no contrato
                const receiverAddress = this.keyDictionary.getWallet({
                    returned: data,
                })[0];

                // 4 - Executar a transferência
                const parfinDTO = dto as Omit<
                    RealTokenizadoInternalTransferDTO,
                    'key' | 'amount' | 'blockchainId'
                >;

                // 5 - pegar endereço do contrato `Real Tokenizado`
                parfinDTO.metadata.contractAddress =
                    await this.contractHelper.getContractAddress(
                        'RealTokenizado',
                    );

                // 6 - codificar a chamada do contrato `Real Tokenizado`
                parfinDTO.metadata.data = this.realTokenizado.transfer(
                    receiverAddress,
                    amount,
                )[0];

                try {
                    // 7 - Interagir com o contrato usando o endpoint send/write
                    const parfinSendRes =
                        await this.parfinService.smartContractSend(parfinDTO);
                    const { id: transactionId } =
                        parfinSendRes as ParfinSuccessRes;

                    if (transactionId) {
                        try {
                            // 8 - Salvar transação no banco
                            const transactionData = {
                                parfinTransactionId: transactionId,
                                operation: TransactionOperations.TRANSFER,
                                asset: AssetTypes.RD,
                                ...parfinDTO,
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
                                        `Erro ao tentar assinar transação ${transactionId} de transferência interna de Real Tokenizado / Erro: ${error}`,
                                    );
                                }
                            }
                        } catch (error) {
                            throw new Error(
                                `Erro ao tentar salvar transação ${transactionId} de transferência de Real Tokenizado no banco / Erro: ${error}`,
                            );
                        }
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar criar transação de transferência de Real Tokenizado / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar buscar carteira do destinatário com documento: ${key} / Erro: ${error}`,
            );
        }
    }
}
