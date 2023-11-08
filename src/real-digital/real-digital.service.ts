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
    RealDigitalDTO,
    RealDigitalTransferDTO,
} from '../dtos/real-digital.dto';
import {
    ParfinContractCallSuccessRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';

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

    async mint(dto: RealDigitalDTO): Promise<any> {
        const { description, assetId, amount } = dto as RealDigitalDTO;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        try {
            // 1. ???
            const str = 'STR';
            const { address } = await this.contractHelper.getContractAddressByName(str);
            if (!address) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${str}`);
            }

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: address,
            };
            parfinSendDTO.metadata.data =
                this.str['requestToMint(uint256)'](Number(amount))[0];

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${str}. Parfin Send DTO: ${payload}`
                );
            }

            // 4. ???
            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.MINT,
                asset: AssetTypes.RD,
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
                `[ERROR]: Erro ao tentar fazer emissão de $${amount} Real Digital. 
                Parfin Send DTO: ${payload}`
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
            const str = 'STR';
            const { address } = await this.contractHelper.getContractAddressByName(str);
            if (!address) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${str}`);
            }

            // 2. ???
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: address,
            };
            parfinSendDTO.metadata.data =
                this.str['requestToBurn(uint256)'](Number(amount))[0];

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${str}. Parfin Send DTO: ${payload}`
                );
            }

            // 4. ???
            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.BURN,
                asset: AssetTypes.RD,
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
                `[ERROR]: Erro ao tentar fazer o resgate de $${amount} Real Digital. Parfin Send DTO: ${payload}`
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
            const realDigitalDefaultAccount = 'RealDigitalDefaultAccount';
            const { address: realDigitalDefaultAccountAddress } = await this.contractHelper.getContractAddressByName(realDigitalDefaultAccount);
            if (!realDigitalDefaultAccountAddress) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${realDigitalDefaultAccount}`);
            }

            // 2. ???
            parfinCallDTO.metadata = {
                data: '',
                contractAddress: realDigitalDefaultAccountAddress,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };
            parfinCallDTO.metadata.data =
                this.realDigitalDefaultAccount['defaultAccount(uint256)'](
                    cnpj,
                )[0];

            // 3. ???
            const parfinCallRes = await this.parfinService.smartContractCall(
                parfinCallDTO,
            );
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;
            if (!data) {
                const payload = JSON.stringify(parfinCallDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${realDigitalDefaultAccount}. 
                    Parfin Call DTO: ${payload}`
                );
            }

            // 4. ???
            const receiverAddress = this.realDigitalDefaultAccount[
                'defaultAccount'
            ](data)[0] as string;

            // 5. ???
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId, ...parfinSendDTO } = parfinDTO;
            parfinSendDTO.description = description;
            parfinSendDTO.source = { assetId };

            // 6. ???
            const realDigital = 'RealDigital'
            const { address: realDigitalAddress } = await this.contractHelper.getContractAddressByName(realDigital);
            parfinSendDTO.metadata = {
                data: '',
                contractAddress: realDigitalAddress,
            };
            if (!realDigitalAddress) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${realDigital}`);
            }

            // 7. ???
            parfinSendDTO.metadata.data = this.realDigital[
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
                    `[ERROR]: Erro ao tentar interagir com contrato ${realDigital}. Parfin Send DTO: ${payload}`
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
                `[ERROR]: Erro ao tentar transferir $${amount} Real Digital para o CNPJ: ${cnpj}`
            );
        }
    }

    async balanceOf(address: string): Promise<{
        realDigitalBalanceOf: number;
        realDigitalFrozenBalanceOf: number;
    }> {
        try {
            const realDigital = 'RealDigital';
            const { address: realDigitalAddress } = await this.contractHelper.getContractAddressByName(realDigital);
            if (!realDigitalAddress) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${realDigital}`);
            }

            const encodedBalanceOfCall = this.realDigital['balanceOf(address)'](address)[0];
            const encodedFrozenBalanceOfCall = this.realDigital['frozenBalanceOf(address)'](address)[0];

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
                            contractAddress: realDigitalAddress,
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
                realDigitalBalanceOf: this.realDigital['balanceOf'](balanceOf)[0],
                realDigitalFrozenBalanceOf: this.realDigital['frozenBalanceOf'](frozenBalanceOf)[0],
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao tentar buscar o saldo de Real Digital do address: ${address}`);
        }
    }
}