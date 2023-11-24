import { Injectable } from '@nestjs/common';
import { ParfinRegisterContractDTO, ParfinContractInteractDTO, ParfinRegisterERC20TokenDTO } from '../dtos/parfin.dto';
import {
    ParfinSuccessRes,
    ParfinRegisterContractSuccessRes,
    ParfinGetAllContractsSuccessRes,
    ParfinContractCallSuccessRes,
    ParfinGetTransactionSuccessRes,
    ParfinCreateWalletSuccessRes,
    ParfinRegisterERC20TokenSuccessRes,
    ParfinGetWalletSuccessRes,
    ParfinGetAllTransactionsSuccessRes,
} from 'src/res/app/parfin.responses';
import { WalletCreateDTO, WalletNewAssetDTO } from '../dtos/wallet.dto';
import { WalletAddNewAssetSuccessRes } from 'src/res/app/wallet.responses';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinHttpService } from './parfin.api.service';

@Injectable()
export class ParfinService {
    constructor(private readonly logger: LoggerService, private readonly parfinHttp: ParfinHttpService) {
        this.logger.setContext('ParfinService');
    }

    //--- Wallet Endpoints
    async createWallet({
        walletName,
        blockchainId,
        walletType,
    }: WalletCreateDTO): Promise<ParfinCreateWalletSuccessRes> {
        const reqBody = {
            walletName,
            blockchainId,
            walletType,
        };
        const url = '/v1/api/wallet';
        return await this.parfinHttp.makeRequest('POST', url, reqBody);
    }

    async addNewAsset(dto: WalletNewAssetDTO): Promise<WalletAddNewAssetSuccessRes> {
        const url = '/v1/api/wallet/add-asset';
        const reqBody = dto;
        return await this.parfinHttp.makeRequest('POST', url, reqBody);
    }

    async getAllWallets(): Promise<ParfinGetWalletSuccessRes[]> {
        const url = '/v1/api/wallet';
        return await this.parfinHttp.makeRequest('GET', url, {});
    }

    async getWalletById(id: string): Promise<ParfinGetWalletSuccessRes> {
        const url = `/v1/api/wallet/${id}`;
        return await this.parfinHttp.makeRequest('GET', url, {});
    }

    //--- Blockchain Token Endpoints
    async registerERC20Token(dto: ParfinRegisterERC20TokenDTO): Promise<ParfinRegisterERC20TokenSuccessRes> {
        const url = '/v1/api/blockchain-token/evm';
        const reqBody = dto;
        return await this.parfinHttp.makeRequest('POST', url, reqBody);
    }

    //--- Web3 Endpoints
    async getAllContracts(): Promise<ParfinGetAllContractsSuccessRes[]> {
        const url = '/v1/api/custody/web3/contract';
        const response: ParfinGetAllContractsSuccessRes[] = await this.parfinHttp.makeRequest('GET', url, {});

        return response;
    }

    async registerContract(dto: ParfinRegisterContractDTO): Promise<ParfinRegisterContractSuccessRes> {
        const url = '/v1/api/custody/web3/contract';
        const reqBody = dto;
        return await this.parfinHttp.makeRequest('POST', url, reqBody);
    }

    async smartContractCall(
        dto: Pick<ParfinContractInteractDTO, 'metadata' | 'blockchainId'>,
    ): Promise<ParfinContractCallSuccessRes> {
        const url = '/v1/api/custody/web3/contract/call';
        const reqBody = dto;
        return await this.parfinHttp.makeRequest('POST', url, reqBody);
    }

    async smartContractSend(dto: Omit<ParfinContractInteractDTO, 'blockchainId'>): Promise<ParfinSuccessRes> {
        const url = '/v1/api/custody/web3/contract/send';
        const reqBody = dto;
        return await this.parfinHttp.makeRequest('POST', url, reqBody);
    }

    //--- Transaction Endpoints
    async getAllTransactions(): Promise<ParfinGetAllTransactionsSuccessRes> {
        const url = `/v1/api/transaction/`;
        return await this.parfinHttp.makeRequest('GET', url, {});
    }

    async getTransactionById(id: string): Promise<ParfinGetTransactionSuccessRes> {
        const url = `/v1/api/transaction/${id}/`;
        return await this.parfinHttp.makeRequest('GET', url, {});
    }

    async transactionSignAndPush(transactionId: string): Promise<any> {
        const url = `/v1/api/transaction/${transactionId}/sign-and-push`;
        return await this.parfinHttp.makeRequest('PUT', url, {});
    }
}
