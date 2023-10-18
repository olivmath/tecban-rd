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
    WalletClientCreateDTO,
    WalletNewAssetDTO,
} from 'src/wallet/dto/wallet.dto';
import { WalletAddNewAssetSuccessRes } from 'src/res/app/wallet.responses';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class ParfinService {
    constructor(
        private readonly preRequest: PreRequest,
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
        const data = {
            walletName,
            blockchainId,
            walletType,
        };
        const url = '/wallet';
        let response;
        try {
            await this.preRequest.setAuthorizationToken('/wallet');
            response = await parfinApi.post(url, data);
        } catch (error) {
            this.logger.error(error);
            throw new Error('Erro ao tentar criar uma nova carteira!');
        }
        return response.data;
    }

    //--- Blockchain Token Endpoints
    async registerERC20Token(
        dto: ParfinRegisterERC20TokenDTO,
    ): Promise<ParfinRegisterERC20TokenSuccessRes | ParfinErrorRes> {
        const url = '/blockchain-token/evm';
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            const response = await parfinApi.post(url, dto);
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
        const url = '/custody/web3/contracts';
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
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
        const url = '/custody/web3/contract';
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            response = await parfinApi.post(url, dto);
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
        const url = '/custody/web3/contract/call';
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            response = await parfinApi.post(url, dto);
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
        const url = '/custody/web3/contract/send';
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            response = await parfinApi.post(url, dto);
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
        const url = `/transaction/${id}/sign-and-push`;
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            response = await parfinApi.put(url, id);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao tentar assinar a transação ${id}!`);
        }
        return response.data;
    }

    async getTransactionById(
        id: string,
    ): Promise<ParfinGetTransactionSuccessRes | ParfinErrorRes> {
        const url = `/transaction/${id}/`;
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            response = await parfinApi.get(url);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao tentar solicitar a transação ${id}!`);
        }
        return response.data;
    }

    async addNewAsset(
        dto: WalletNewAssetDTO,
    ): Promise<WalletAddNewAssetSuccessRes | ParfinErrorRes> {
        const url = '/wallet/add-asset';
        let response;
        try {
            await this.preRequest.setAuthorizationToken(url);
            response = await parfinApi.post(url, dto);
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar adicionar o Token: ${dto.blockchainTokenId} na carteira: ${dto.walletId}`,
            );
        }
        return response.data;
    }
}
