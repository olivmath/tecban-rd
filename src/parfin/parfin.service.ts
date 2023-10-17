import { Injectable } from '@nestjs/common';
import { parfinApi } from 'src/config/parfin-api-client';
import { PreRequest } from 'src/helpers/pre-request';
import {
    ParfinDeployContractDTO,
    ParfinRegisterContractDTO,
    ParfinContractInteractDTO,
    ParfinRegisterERC20TokenDTO,
} from './dtos/parfin.dto';
import {
    ParfinSuccessRes,
    ParfinRegisterContractSuccessRes,
    ParfinGetAllContractsSuccessRes,
    ParfinContractCallSuccessRes,
    ParfinErrorRes,
    ParfinGetTransactionSuccessRes,
    ParfinCreateWalletSuccessRes,
    ParfinRegisterERC20TokenSuccessRes,
} from 'src/res/app/parfin.responses';
import {
    WalletInstitutionCreateDTO,
    WalletClientCreateDTO
} from 'src/wallet/dto/wallet.dto';

@Injectable()
export class ParfinService {
    constructor(private readonly preRequest: PreRequest) { }

    //--- Wallet Endpoints
    async createWallet({
        walletName,
        blockchainId,
        walletType,
    }: WalletInstitutionCreateDTO | WalletClientCreateDTO):
        Promise<ParfinCreateWalletSuccessRes | ParfinErrorRes> {
        const data = {
            walletName,
            blockchainId,
            walletType,
        };
        try {
            await this.preRequest.setAuthorizationToken();
            const url = `/wallet`;
            const response = await parfinApi.post(url, data, {
                headers: {
                    'x-api-key': process.env.X_API_KEY,
                },
            });

            return response.data;
        } catch (error) {
            throw new Error(`Erro ao tentar criar uma nova carteira!`);
        }
    }

    //--- Blockchain Token Endpoints
    async registerERC20Token(dto: ParfinRegisterERC20TokenDTO): Promise<
        ParfinRegisterERC20TokenSuccessRes | ParfinErrorRes
    > {
        try {
            await this.preRequest.setAuthorizationToken();
            const url = '/blockchain-token/evm';
            const data = {
                ...dto
            };
            const response = await parfinApi.post(url, data);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao registrar um novo token ERC20!');
        }
    }

    //--- Web3 Endpoints
    async getAllContracts(): Promise<
        ParfinGetAllContractsSuccessRes[] | ParfinErrorRes
    > {
        try {
            await this.preRequest.setAuthorizationToken();
            const response = await parfinApi.get(`/custody/web3/contracts`);
            return response.data;
        } catch (error) {
            console.log(error);
            throw new Error('Erro ao listar os contratos!');
        }
    }

    async deployContract(
        dto: ParfinDeployContractDTO,
    ): Promise<ParfinSuccessRes | ParfinErrorRes> {
        // Aqui você pode implementar a lógica para realizar o deploy do contrato
        // Por enquanto, vamos apenas simular o deploy e retornar um objeto com o ID do contrato e o hash da transação
        const id = 'TRANSACTION_ID_EXAMPLE';

        return {
            id,
        };
    }

    async registerContract(
        dto: ParfinRegisterContractDTO,
    ): Promise<ParfinRegisterContractSuccessRes | ParfinErrorRes> {
        const { contractAddress } = dto;
        try {
            await this.preRequest.setAuthorizationToken();
            const url = `/custody/web3/contract`;
            const response = await parfinApi.post(url, dto);
            return response.data;
        } catch (error) {
            throw new Error(
                `Erro ao tentar registrar o contrato: ${contractAddress}`,
            );
        }
    }

    async smartContractCall(
        dto: ParfinContractInteractDTO,
    ): Promise<ParfinContractCallSuccessRes | ParfinErrorRes> {
        const {
            metadata: { contractAddress },
        } = dto;
        try {
            await this.preRequest.setAuthorizationToken();
            const url = `/custody/web3/contract/call`;
            const response = await parfinApi.post(url, dto);
            return response.data;
        } catch (error) {
            throw new Error(
                `Erro ao tentar visualizar informações do contrato: ${contractAddress}`,
            );
        }
    }

    async smartContractSend(
        dto: ParfinContractInteractDTO,
    ): Promise<ParfinSuccessRes | ParfinErrorRes> {
        const {
            metadata: { contractAddress },
        } = dto;
        try {
            await this.preRequest.setAuthorizationToken();
            const url = `/custody/web3/contract/send`;
            const response = await parfinApi.post(url, dto);
            return response.data;
        } catch (error) {
            throw new Error(
                `Erro ao tentar interagir com o contrato: ${contractAddress}`,
            );
        }
    }

    //--- Transaction Endpoints
    async transactionSignAndPush(id: string): Promise<any | ParfinErrorRes> {
        try {
            await this.preRequest.setAuthorizationToken();
            const url = `/transaction/${id}/sign-and-push`;
            const response = await parfinApi.put(url, id);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao tentar assinar a transação ${id}!`);
        }
    }

    async getTransactionById(id: string): Promise<
        ParfinGetTransactionSuccessRes | ParfinErrorRes
    > {
        try {
            await this.preRequest.setAuthorizationToken();
            const url = `/transaction/${id}/`;
            const response = await parfinApi.get(url);
            return response.data;
        } catch (error) {
            throw new Error(`Erro ao tentar solicitar a transação ${id}!`);
        }
    }
}