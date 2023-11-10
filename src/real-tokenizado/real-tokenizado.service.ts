import { TransactionsService } from 'src/transactions/transactions.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
    RealTokenizadoMintDTO,
    RealTokenizadoBurnDTO,
    RealTokenizadoInternalTransferDTO,
    RealTokenizadoApproveDTO,
    RealTokenizadoBurnFromDTO,
    RealTokenizadoExternalTransferDTO,
} from '../dtos/real-tokenizado.dto';
import {
    ParfinContractCallSuccessRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from 'src/dtos/parfin.dto';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';

@Injectable()
export class RealTokenizadoService {
    keyDictionary: WrapperContractABI;
    realTokenizado: WrapperContractABI;
    swapOneStep: WrapperContractABI;
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly contractHelper: ContractHelperService,
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService,
    ) {
        this.realTokenizado =
            this.contractHelper.getContractMethods('REAL_TOKENIZADO');
        this.keyDictionary =
            this.contractHelper.getContractMethods('KEY_DICTIONARY');
        this.logger.setContext('RealTokenizadoService');
    }

    async approve(dto: RealTokenizadoApproveDTO): Promise<any> {
        const { description, walletAddress, assetId, spender, amount } = dto as RealTokenizadoApproveDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;

        // 1. Criando o DTO para o método approve()
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        // 3. Pegando endereço do contrato Real Tokenizado
        const realTokenizadoAddress = process.env.REAL_TOKENIZADO_ARBI_ADDRESS;

        try {
            // 4. Criando o metadata do approve()
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: walletAddress,
            };
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

            // 6. Assinando a transação do approve()
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId
            };
        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO)
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer o approve do valor de $${amount} Real Tokenizado. 
                Parfin Send DTO: ${payload}`
            );
        }
    }

    async mint(dto: RealTokenizadoMintDTO): Promise<any> {
        const { description, to, amount } = dto as RealTokenizadoMintDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId: process.env.ARBI_RT_ASSET_ID };

        try {
            // 1. ???
            const realTokenizadoAddress = process.env.REAL_TOKENIZADO_ARBI_ADDRESS;

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
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId
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

        // 1. Criando o DTO para o método burn()
        parfinBurnDTO.description = description;
        parfinBurnDTO.source = { assetId };


        // 2. Pegando endereço do contrato Real Tokenizado
        const realTokenizadoAddress = process.env.REAL_TOKENIZADO_ARBI_ADDRESS;

        try {
            // 3. Criando o metadata do burn()
            parfinBurnDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: walletAddress,
            };
            parfinBurnDTO.metadata.data =
                this.realTokenizado['burn(uint256)'](Number(amount))[0];

            // 4. Interagindo com o método burn()
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

            // 5. Assinando a transação do burn()
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId
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

        // 1. Criando o DTO para o método burn()
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId: process.env.ARBI_RT_ASSET_ID };

        // 2. Pegando endereço do contrato Real Tokenizado
        const realTokenizadoAddress = process.env.REAL_TOKENIZADO_ARBI_ADDRESS;

        try {
            // 3. Criando o metadata do burn()
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realTokenizadoAddress,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };
            parfinSendDTO.metadata.data =
                this.realTokenizado['burnFrom(address,uint256)'](account, Number(amount))[0];

            // 4. Interagindo com o método burn()
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

            // 5. Assinando a transação do burnFrom()
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId
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
        const { description, walletAddress, assetId, key, amount } = dto as RealTokenizadoInternalTransferDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const parfinCallDTO = {
            metadata: parfinDTO.metadata,
            blockchainId: parfinDTO.blockchainId,
        };

        try {
            // 1. ???
            const keyDictionary = 'KEY_DICTIONARY';
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
                    `[ERROR]: Erro ao tentar interagir com contrato ${keyDictionaryAddress}. 
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
            const realTokenizadoAddress = process.env.REAL_TOKENIZADO_ARBI_ADDRESS;

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
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar transferir $${amount} Real Tokenizado para o CPF hash: ${key}`
            );
        }
    }

    async externalTransfer(dto: RealTokenizadoExternalTransferDTO): Promise<any> {
        const {
            description, walletAddress, assetId, tokenReceiver, receiver, amount
        } = dto as RealTokenizadoExternalTransferDTO;

        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        const swapOneStepAddress = process.env.SWAP_ONE_STEP_ADDRESS;
        const tokenSender = process.env.REAL_TOKENIZADO_ARBI_ADDRESS;

        parfinSendDTO.metadata = {
            data: '',
            contractAddress: swapOneStepAddress,
            from: walletAddress,
        };
        try {
            parfinSendDTO.metadata.data = this.swapOneStep[
                'executeSwap(address,address,address,uint256)'
            ](tokenSender, tokenReceiver, receiver, Number(amount))[0];

            const parfinSendRes =
                await this.parfinService.smartContractSend(
                    parfinSendDTO,
                );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${payload}`
                );
            }

            await this.parfinService.transactionSignAndPush(transactionId);

            return transactionId;
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar transferir $${amount} Real Tokenizado para a carteira ${receiver}`
            );
        }
    }

    async balanceOf(address: string): Promise<{
        realTokenizadoBalanceOf: number;
        realTokenizadoFrozenBalanceOf: number;
    }> {
        const realTokenizadoAddress = process.env.ARBI_REAL_TOKENIZADO_ADDRESS;
        const encodedBalanceOfCall = this.realTokenizado['balanceOf(address)'](address)[0];
        const encodedFrozenBalanceOfCall = this.realTokenizado['frozenBalanceOf(address)'](address)[0];
        const parfinDTO = new ParfinContractInteractDTO();

        const { data: encodedBalanceOfResponse } = await this.parfinService.smartContractCall({
            blockchainId: parfinDTO.blockchainId,
            metadata: {
                data: encodedBalanceOfCall,
                contractAddress: realTokenizadoAddress,
            },
        });

        const { data: encodedFrozenBalanceOfResponse } = await this.parfinService.smartContractCall({
            blockchainId: parfinDTO.blockchainId,
            metadata: {
                data: encodedFrozenBalanceOfCall,
                contractAddress: realTokenizadoAddress,
            },
        });

        return {
            realTokenizadoBalanceOf: this.realTokenizado['balanceOf'](encodedBalanceOfResponse)[0],
            realTokenizadoFrozenBalanceOf: this.realTokenizado['frozenBalanceOf'](encodedFrozenBalanceOfResponse)[0],
        };
    }
}

