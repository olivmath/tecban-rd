import { TransactionsService } from 'src/transactions/transactions.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import ContractWrapper from 'src/utils/contract-util/contract-wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
    AssetTypes,
    TransactionOperations,
} from '../types/transactions.types';
import {
    RealTokenizadoMintDTO,
    RealTokenizadoBurnDTO,
    RealTokenizadoInternalTransferDTO,
} from '../dtos/real-tokenizado.dto';
import {
    ParfinContractCallSuccessRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from 'src/dtos/parfin.dto';

@Injectable()
export class RealTokenizadoService {
    keyDictionary: ContractWrapper;
    realTokenizado: ContractWrapper;
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly contractHelper: ContractHelperService,
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService,
    ) {
        this.realTokenizado =
            this.contractHelper.getContractMethods('RealTokenizado');
        this.keyDictionary =
            this.contractHelper.getContractMethods('KeyDictionary');
        this.logger.setContext('RealTokenizadoService');
    }

    async mint(dto: RealTokenizadoMintDTO): Promise<any> {
        const { description, assetId, to, amount } = dto as RealTokenizadoMintDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        try {
            // 1. ???
            const address = process.env.REAL_TOKENIZADO_ADDRESS;

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: address,
            };
            parfinSendDTO.metadata.data = this.realTokenizado[
                'mint(address,uint256)'
            ](to, amount)[0];

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado (Banco Arbi). 
                    Parfin Send DTO: ${payload}`
                );
            }

            // 4. ???
            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.MINT,
                asset: AssetTypes.RT,
                ...parfinSendDTO,
            };

            const { id: dbTransactionId } =
                await this.transactionService.create(transactionData);
            if (!dbTransactionId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                );
            }

            // 5. ???
            const { statusDescription } = await this.transactionService.transactionSignAndPush(
                transactionId,
                dbTransactionId,
            );
            if (!statusDescription) {
                throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
            }

            return {
                parfinId: transactionId,
                status: statusDescription
            };

        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO)
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer emissão de $${amount} Real Tokenizado para a carteira ${to}. 
                Parfin Send DTO: ${payload}`
            );
        }
    }

    async burn(dto: RealTokenizadoBurnDTO): Promise<any> {
        const { description, assetId, amount } = dto as RealTokenizadoBurnDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        try {
            // 1. ???
            const address = process.env.REAL_TOKENIZADO_ADDRESS;

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: address,
            };
            parfinSendDTO.metadata.data =
                this.realTokenizado['burn(uint256)'](amount)[0];

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
                );
            }

            // 4. ???
            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.BURN,
                asset: AssetTypes.RT,
                ...parfinSendDTO,
            };

            const { id: dbTransactionId } =
                await this.transactionService.create(transactionData);
            if (!dbTransactionId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                );
            }

            // 5. ???
            const { statusDescription } = await this.transactionService.transactionSignAndPush(
                transactionId,
                dbTransactionId,
            );
            if (!statusDescription) {
                throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
            }

            return {
                parfinId: transactionId,
                status: statusDescription
            };

        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO)
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer o resgate de $${amount} Real Tokenizado. 
                Parfin Send DTO: ${payload}`
            );
        }
    }

    async internalTransfer(
        dto: RealTokenizadoInternalTransferDTO,
    ): Promise<any> {
        const { description, assetId, key, amount } = dto as RealTokenizadoInternalTransferDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const parfinCallDTO = {
            metadata: parfinDTO.metadata,
            blockchainId: parfinDTO.blockchainId,
        };

        try {
            // 1. ???
            const keyDictionary = 'KeyDictionary';
            const { address: keyDictionaryAddress } = await this.contractHelper.getContractAddress(keyDictionary);
            if (!keyDictionaryAddress) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${keyDictionary}`);
            }

            // 2. ???
            parfinCallDTO.metadata = {
                data: '',
                contractAddress: keyDictionaryAddress,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };
            parfinCallDTO.metadata.data =
                this.keyDictionary['getWallet(bytes32)'](key)[0];

            // 3. ???
            const parfinCallRes = await this.parfinService.smartContractCall(
                parfinCallDTO,
            );
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;
            if (!data) {
                const payload = JSON.stringify(parfinCallDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${keyDictionary}. 
                    Parfin Call DTO: ${payload}`
                );
            }

            // 4. ???
            const receiverAddress = this.keyDictionary['getWallet'](data)[0];

            // 5. ???
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId, ...parfinSendDTO } = parfinDTO;
            parfinSendDTO.description = description;
            parfinSendDTO.source = { assetId };

            // 6. ???
            const address = process.env.REAL_TOKENIZADO_ADDRESS;

            // 7. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: address,
            };
            parfinSendDTO.metadata.data = this.realTokenizado[
                'transfer(address,uint256)'
            ](receiverAddress, amount)[0];

            // 8. ???
            const parfinSendRes =
                await this.parfinService.smartContractSend(
                    parfinSendDTO,
                );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. 
                    Parfin Send DTO: ${payload}`
                );
            }

            // 9. ???
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
            if (!dbTransactionId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                );
            }

            // 10. ???
            const { statusDescription } = await this.transactionService.transactionSignAndPush(
                transactionId,
                dbTransactionId,
            );
            if (!statusDescription) {
                throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
            }

            return {
                parfinId: transactionId,
                status: statusDescription
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar transferir $${amount} Real Digital para o CPF hash: ${key}`
            );
        }
    }

    async balanceOf(address: string): Promise<{
        realTokenizadoBalanceOf: number;
        realTokenizadoFrozenBalanceOf: number;
    }> {
        try {
            const realTokenizadoAddress = process.env.REAL_TOKENIZADO_ADDRESS;

            const encodedBalanceOfCall = this.realTokenizado['balanceOf(address)'](address)[0];
            const encodedFrozenBalanceOfCall = this.realTokenizado['frozenBalanceOf(address)'](address)[0];

            const parfinDTO = new ParfinContractInteractDTO();

            const requests = [
                { id: 'balanceOf', data: encodedBalanceOfCall },
                { id: 'frozenBalanceOf', data: encodedFrozenBalanceOfCall },
            ];

            const allResponse = await Promise.all(
                requests.map(async (request) => {
                    return this.parfinService.smartContractCall({
                        metadata: {
                            data: request.data,
                            contractAddress: realTokenizadoAddress,
                        },
                        blockchainId: parfinDTO.blockchainId,
                    });
                }),
            );

            const responses: { balanceOf?: string; frozenBalanceOf?: string } = {};
            allResponse.forEach((response: ParfinContractCallSuccessRes, index) => {
                const requestId = requests[index].id;
                responses[requestId] = response.data;
            });

            const balanceOf = responses.balanceOf;
            const frozenBalanceOf = responses.frozenBalanceOf;
            return {
                realTokenizadoBalanceOf: this.realTokenizado['balanceOf'](balanceOf)[0],
                realTokenizadoFrozenBalanceOf: this.realTokenizado['frozenBalanceOf'](frozenBalanceOf)[0],
            };

        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao tentar buscar o saldo de Real Digital do address: ${address}`);
        }
    }
}
