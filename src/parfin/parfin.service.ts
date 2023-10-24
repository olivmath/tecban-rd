import { Injectable } from '@nestjs/common';
import { parfinApi } from 'src/config/parfin-api-client';
// import { parfinAuth } from 'src/helpers/pre-request';
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
    ParfinGetWalletSuccessRes,
} from 'src/res/app/parfin.responses';
import {
    WalletInstitutionCreateDTO,
    WalletClientCreateDTO,
    WalletNewAssetDTO,
} from 'src/wallet/dto/wallet.dto';
import { WalletAddNewAssetSuccessRes } from 'src/res/app/wallet.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinAuth } from 'src/auth/parfin.auth';

@Injectable()
export class ParfinService {
    constructor(
        private readonly parfinAuth: ParfinAuth,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('ParfinService');
    }

    //--- Wallet Endpoints
    async createWallet({
        walletName,
        blockchainId,
        walletType,
    }: WalletInstitutionCreateDTO | WalletClientCreateDTO): Promise<
        ParfinCreateWalletSuccessRes | ParfinErrorRes
    > {
        const reqBody = {
            walletName,
            blockchainId,
            walletType,
        };
        const url = '/v1/api/wallet';
        let response;
        try {
            await this.parfinAuth.setAuth(url, reqBody);
            response = await parfinApi.post(url, reqBody);
        } catch (error) {
            this.logger.error(error);
            throw new Error('Erro ao tentar criar uma nova carteira!');
        }
        return response.data;
    }

    async addNewAsset(
        dto: WalletNewAssetDTO,
    ): Promise<WalletAddNewAssetSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/wallet/add-asset';
        const reqBody = dto;
        let response;
        try {
            await this.parfinAuth.setAuth(url, reqBody);
            response = await parfinApi.post(url, reqBody);
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar adicionar o Token: ${dto.blockchainTokenId} na carteira: ${dto.walletId}`,
            );
        }
        return response.data;
    }

    async getAllWallets(): Promise<
        ParfinGetWalletSuccessRes[] | ParfinErrorRes
    > {
        const url = '/v1/api/wallet';
        let response;
        try {
            await this.parfinAuth.setAuth(url, {});
            response = await parfinApi.get(url);
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar buscar as carteiras registradas na Parfin!`,
            );
        }
        return response.data;
    }

    //--- Blockchain Token Endpoints
    async registerERC20Token(
        dto: ParfinRegisterERC20TokenDTO,
    ): Promise<ParfinRegisterERC20TokenSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/blockchain-token/evm';
        const reqBody = dto;
        let response;
        try {
            await this.parfinAuth.setAuth(url, reqBody);
            response = await parfinApi.post(url, reqBody);
        } catch (error) {
            this.logger.error(error);
            throw new Error('Erro ao registrar um novo token ERC20!');
        }
        return response.data;
    }

    //--- Web3 Endpoints
    async getAllContracts(): Promise<
        ParfinGetAllContractsSuccessRes[] | ParfinErrorRes
    > {
        const url = '/v1/api/custody/web3/contract';
        let response;
        try {
            await this.parfinAuth.setAuth(url, {});
            response = await parfinApi.get(url);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao listar os contratos!}`);
        }
        return response.data;
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
        const url = '/v1/api/custody/web3/contract';
        const reqBody = dto;
        let response;
        try {
            await this.parfinAuth.setAuth(url, reqBody);
            response = await parfinApi.post(url, reqBody);
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar registrar o contrato: ${dto.contractAddress}`,
            );
        }
        return response.data;
    }

    async smartContractCall(
        dto: ParfinContractInteractDTO,
    ): Promise<ParfinContractCallSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/custody/web3/contract/call';
        const reqBody = dto;
        let response;
        try {
            await this.parfinAuth.setAuth(url, reqBody);
            response = await parfinApi.post(url, reqBody);
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar visualizar informações do contrato: ${dto.metadata.contractAddress}`,
            );
        }
        return response.data;
    }

    async smartContractSend(
        dto: ParfinContractInteractDTO,
    ): Promise<ParfinSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/custody/web3/contract/send';
        const reqBody = dto;
        let response;
        try {
            await this.parfinAuth.setAuth(url, reqBody);
            response = await parfinApi.post(url, reqBody);
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar interagir com o contrato: ${dto.metadata.contractAddress}`,
            );
        }
        return response.data;
    }

    //--- Transaction Endpoints
    async transactionSignAndPush(id: string): Promise<any | ParfinErrorRes> {
        const url = `/v1/api/transaction/${id}/sign-and-push`;
        let response;
        try {
            await this.parfinAuth.setAuth(url, {});
            response = await parfinApi.put(url);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao tentar assinar a transação ${id}!`);
        }
        return response.data;
    }

    async getTransactionById(
        id: string,
    ): Promise<ParfinGetTransactionSuccessRes | ParfinErrorRes> {
        const url = `/v1/api/transaction/${id}/`;
        let response;
        try {
            await this.parfinAuth.setAuth(url, {});
            response = await parfinApi.get(url);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao tentar solicitar a transação ${id}!`);
        }
        return response.data;
    }
}
