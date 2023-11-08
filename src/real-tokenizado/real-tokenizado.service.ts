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
    RealTokenizadoApproveDTO,
    RealTokenizadoBurnFromDTO,
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
        const { description, to, amount } = dto as RealTokenizadoMintDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId: process.env.ARBI_RT_ASSET_ID };

        try {
            // 1. ???
            const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };
            parfinSendDTO.metadata.data = this.realTokenizado[
                'mint(address,uint256)'
            ](to, Number(amount))[0];

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
        const { description, walletAddress, assetId, amount } = dto as RealTokenizadoBurnDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinBurnDTO } = parfinDTO;

        // 2. Criando o DTO para o método burn()
        parfinBurnDTO.description = description;
        parfinBurnDTO.source = { assetId };


        // 3. Pegando endereço do contrato Real Tokenizado
        const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;

        try {
            // 8. Criando o metadata do burn()
            parfinBurnDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: walletAddress,
            };
            parfinBurnDTO.metadata.data =
                this.realTokenizado['burn(uint256)'](Number(amount))[0];

            // 9. Interagindo com o método burn()
            const parfinBurnRes = await this.parfinService.smartContractSend(
                parfinBurnDTO,
            );
            const { id: transactionId } = parfinBurnRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinBurnDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
                );
            }

            // 10. Salvando a transação do burn()
            const burnTransactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.BURN,
                asset: AssetTypes.RT,
                ...parfinBurnDTO,
            };

            const { id: dbtransactionId } =
                await this.transactionService.create(burnTransactionData);
            if (!dbtransactionId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${burnTransactionData}`
                );
            }

            // 11. Assinando a transação do approve()
            const { statusDescription: burnStatus } = await this.transactionService.transactionSignAndPush(
                transactionId,
                dbtransactionId,
            );
            if (!burnStatus) {
                throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${burnTransactionData}`);
            }

            return {
                parfinId: transactionId,
                status: burnStatus,
            };

        } catch (error) {
            const payload = JSON.stringify(parfinBurnDTO)
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer o resgate de $${amount} Real Tokenizado. 
                Parfin Send DTO: ${payload}`
            );
        }
    }

    async burnFrom(dto: RealTokenizadoBurnFromDTO): Promise<any> {
        const { description, account, amount } = dto as RealTokenizadoBurnFromDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;

        // 2. Criando o DTO para o método burn()
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId: process.env.ARBI_RT_ASSET_ID };

        // 3. Pegando endereço do contrato Real Tokenizado
        const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;

        try {
            // 8. Criando o metadata do burn()
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };
            parfinSendDTO.metadata.data =
                this.realTokenizado['burnFrom(address,uint256)'](account, Number(amount))[0];

            // 9. Interagindo com o método burn()
            const parfinBurnRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinBurnRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
                );
            }

            // 10. Salvando a transação do burn()
            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.BURN_FROM,
                asset: AssetTypes.RT,
                ...parfinSendDTO,
            };

            const { id: dbtransactionId } =
                await this.transactionService.create(transactionData);
            if (!dbtransactionId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                );
            }

            // 11. Assinando a transação do approve()
            const { statusDescription: status } = await this.transactionService.transactionSignAndPush(
                transactionId,
                dbtransactionId,
            );
            if (!status) {
                throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
            }

            return {
                parfinId: transactionId,
                status: status,
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

    async approve(dto: RealTokenizadoApproveDTO): Promise<any> {
        const { description, walletAddress, assetId, amount } = dto as RealTokenizadoApproveDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;

        // 1. Criando o DTO para o método approve()
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        // 3. Pegando endereço do contrato Real Tokenizado
        const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;

        try {
            // 4. Criando o metadata do approve()
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: walletAddress,
            };
            const spender = process.env.ARBI_DEFAULT_WALLET_ADDRESS;
            parfinSendDTO.metadata.data =
                this.realTokenizado['approve(address,uint256)'](spender, Number(amount))[0];

            // 5. Interagindo com o método approve()
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            // O aprove() retorna um valor boolean como output porém não é retornado pelo endpoint da Parfin

            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
                );
            }

            // 6. Salvando a transação do approve()
            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.APPROVE,
                asset: AssetTypes.RT,
                ...parfinSendDTO,
            };

            const { id: dbtransactionId } =
                await this.transactionService.create(transactionData);
            if (!dbtransactionId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                );
            }

            // 7. Assinando a transação do approve()
            const { statusDescription: status } = await this.transactionService.transactionSignAndPush(
                transactionId,
                dbtransactionId,
            );
            if (!status) {
                throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
            }

            return {
                parfinId: transactionId,
                status: status,
            };
        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO)
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer o approve do resgate de $${amount} Real Tokenizado. 
                Parfin Send DTO: ${payload}`
            );
        }
    }

    async internalTransfer(
        dto: RealTokenizadoInternalTransferDTO,
    ): Promise<any> {
        const { description, walletAddress, assetId, key, amount } = dto as RealTokenizadoInternalTransferDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const parfinCallDTO = {
            metadata: parfinDTO.metadata,
            blockchainId: parfinDTO.blockchainId,
        };

        try {
            // 1. ???
            const keyDictionary = 'KeyDictionary';
            const { address: keyDictionaryAddress } = await this.contractHelper.getContractAddressByName(keyDictionary);
            if (!keyDictionaryAddress) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${keyDictionary}`);
            }

            // 2. ???
            parfinCallDTO.metadata = {
                data: '',
                contractAddress: keyDictionaryAddress,
                from: walletAddress,
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
            const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;

            // 7. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
            };
            parfinSendDTO.metadata.data = this.realTokenizado[
                'transfer(address,uint256)'
            ](receiverAddress, Number(amount))[0];

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
                operation: TransactionOperations.INTERNAL_TRANSFER,
                asset: AssetTypes.RT,
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
            const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;

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
