import { TransactionsService } from 'src/transactions/transactions.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import {
    RealDigitalApproveDTO,
    RealDigitalDTO,
    RealDigitalTransferDTO,
} from '../dtos/real-digital.dto';
import {
    ParfinContractCallSuccessRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';

@Injectable()
export class RealDigitalService {
    str: WrapperContractABI;
    realDigitalDefaultAccount: WrapperContractABI;
    realDigital: WrapperContractABI;
    constructor(
        private readonly transactionService: TransactionsService,
        private readonly contractHelper: ContractHelperService,
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService,
    ) {
        this.str = this.contractHelper.getContractMethods('STR');
        this.realDigital =
            this.contractHelper.getContractMethods('REAL_DIGITAL');
        this.realDigitalDefaultAccount = this.contractHelper.getContractMethods(
            'REAL_DIGITAL_DEFAULT_ACCOUNT',
        );
        this.logger.setContext('RealDigitalService');
    }

    async approve(dto: RealDigitalApproveDTO): Promise<any> {
        const { description, walletAddress, assetId, amount } = dto as RealDigitalApproveDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;

        // 1. Criando o DTO para o método approve()
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        // 3. Pegando endereço do contrato Real Tokenizado
        const realDigitalAddress = process.env.REAL_DIGITAL_ADDRESS;

        try {
            // 4. Criando o metadata do approve()
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realDigitalAddress,
                from: walletAddress,
            };
            const spender = process.env.SWAP_ONE_STEP_ADDRESS;
            parfinSendDTO.metadata.data =
                this.realDigital['approve(address,uint256)'](spender, Number(amount))[0];

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
                parfinTxId: transactionId,
            };
        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO)
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer o approve do valor de $${amount} Real Digital. 
                Parfin Send DTO: ${payload}`
            );
        }
    }

    async mint(dto: RealDigitalDTO): Promise<any> {
        const { description, assetId, amount } = dto as RealDigitalDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        try {
            // 1. ???
            const strAddress = process.env.STR_ADDRESS;

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: strAddress,
            };
            parfinSendDTO.metadata.data = this.str['requestToMint(uint256)'](Number(amount))[0];

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${strAddress}. Parfin Send DTO: ${payload}`
                );
            }

            // 5. ???
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId,
            };
        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO);
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer emissão de $${amount} Real Digital. 
                Parfin Send DTO: ${payload}`,
            );
        }
    }

    async burn(dto: RealDigitalDTO): Promise<any> {
        const { description, assetId, amount } = dto as RealDigitalDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        try {
            // 1. ???
            const strAddress = process.env.STR_ADDRESS;

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: strAddress,
            };
            parfinSendDTO.metadata.data = this.str['requestToBurn(uint256)'](Number(amount))[0];

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${strAddress}. Parfin Send DTO: ${payload}`
                );
            }

            // 5. ???
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId,
            };
        } catch (error) {
            const payload = JSON.stringify(parfinSendDTO);
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar fazer o resgate de $${amount} Real Digital. Parfin Send DTO: ${payload}`,
            );
        }
    }

    async transfer(dto: RealDigitalTransferDTO): Promise<any> {
        const { description, assetId, cnpj, amount } = dto as RealDigitalTransferDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const parfinCallDTO = {
            metadata: parfinDTO.metadata,
            blockchainId: parfinDTO.blockchainId,
        };

        try {
            // 1. ???
            const realDigitalDefaultAccount = 'REAL_DIGITAL_DEFAULT_ACCOUNT';
            const { address: realDigitalDefaultAccountAddress } = await this.contractHelper.getContractAddress(realDigitalDefaultAccount);
            if (!realDigitalDefaultAccountAddress) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${realDigitalDefaultAccount}`);
            }

            // 2. ???
            parfinCallDTO.metadata = {
                data: '',
                contractAddress: realDigitalDefaultAccountAddress,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };
            parfinCallDTO.metadata.data = this.realDigitalDefaultAccount['defaultAccount(uint256)'](cnpj)[0];

            // 3. ???
            const parfinCallRes = await this.parfinService.smartContractCall(parfinCallDTO);
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;
            if (!data) {
                const payload = JSON.stringify(parfinCallDTO);
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${realDigitalDefaultAccountAddress}. 
                    Parfin Call DTO: ${payload}`
                );
            }

            // 4. ???
            const receiverAddress = this.realDigitalDefaultAccount['defaultAccount'](data)[0] as string;

            // 5. ???
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId, ...parfinSendDTO } = parfinDTO;
            parfinSendDTO.description = description;
            parfinSendDTO.source = { assetId };

            // 6. ???
            const realDigital = 'REAL_DIGITAL'
            const { address: realDigitalAddress } = await this.contractHelper.getContractAddress(realDigital);
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realDigitalAddress,
            };

            // 7. ???
            parfinSendDTO.metadata.data = this.realDigital['transfer(address,uint256)'](
                receiverAddress,
                Number(amount),
            )[0];

            // 8. ???
            const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO);
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${realDigitalAddress}. Parfin Send DTO: ${payload}`
                );
            }

            // 9. ???
            await this.parfinService.transactionSignAndPush(transactionId);

            return {
                parfinTxId: transactionId
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao tentar transferir $${amount} Real Digital para o CNPJ: ${cnpj}`);
        }
    }

    async balanceOf(address: string): Promise<{
        realDigitalBalanceOf: number;
        realDigitalFrozenBalanceOf: number;
    }> {
        const realDigital = 'REAL_DIGITAL';
        const { address: realDigitalAddress } = this.contractHelper.getContractAddress(realDigital);
        const encodedBalanceOfCall = this.realDigital['balanceOf(address)'](address)[0];
        const encodedFrozenBalanceOfCall = this.realDigital['frozenBalanceOf(address)'](address)[0];
        const parfinDTO = new ParfinContractInteractDTO();

        const { data: encodedBalanceOfResponse } = await this.parfinService.smartContractCall({
            blockchainId: parfinDTO.blockchainId,
            metadata: {
                data: encodedBalanceOfCall,
                contractAddress: realDigitalAddress,
            },
        });

        const { data: encodedFrozenBalanceOfResponse } = await this.parfinService.smartContractCall({
            blockchainId: parfinDTO.blockchainId,
            metadata: {
                data: encodedFrozenBalanceOfCall,
                contractAddress: realDigitalAddress,
            },
        });

        const realDigitalBalanceOf = this.realDigital['balanceOf'](encodedBalanceOfResponse)[0]
        const realDigitalFrozenBalanceOf = this.realDigital['frozenBalanceOf'](encodedFrozenBalanceOfResponse)[0]
        return {
            realDigitalBalanceOf,
            realDigitalFrozenBalanceOf
        };
    }
}
