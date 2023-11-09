import { Injectable } from '@nestjs/common';
import { ParfinRegisterContractDTO, ParfinContractInteractDTO, ParfinRegisterERC20TokenDTO } from '../dtos/parfin.dto';
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
    }: WalletCreateDTO): Promise<ParfinCreateWalletSuccessRes | ParfinErrorRes> {
        const reqBody = {
            walletName,
            blockchainId,
            walletType,
        };
        const url = '/v1/api/wallet';
        const response = await this.parfinHttp.makeRequest('POST', url, reqBody);
        return response.data;
    }

    async addNewAsset(dto: WalletNewAssetDTO): Promise<WalletAddNewAssetSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/wallet/add-asset';
        const reqBody = dto;
        const response = await this.parfinHttp.makeRequest('POST', url, reqBody);
        return response.data;
    }

    async getAllWallets(): Promise<ParfinGetWalletSuccessRes[] | ParfinErrorRes> {
        const url = '/v1/api/wallet';
        const response = await this.parfinHttp.makeRequest('GET', url, {});
        return response.data;
    }

    async getWalletById(id: string): Promise<ParfinGetWalletSuccessRes | ParfinErrorRes> {
        const url = `/v1/api/wallet/${id}`;
        const response = await this.parfinHttp.makeRequest('GET', url, {});
        return response.data;
    }

    //--- Blockchain Token Endpoints
    async registerERC20Token(
        dto: ParfinRegisterERC20TokenDTO,
    ): Promise<ParfinRegisterERC20TokenSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/blockchain-token/evm';
        const reqBody = dto;
        const response = await this.parfinHttp.makeRequest('POST', url, reqBody);
        return response.data;
    }

    //--- Web3 Endpoints
    async getAllContracts(): Promise<ParfinGetAllContractsSuccessRes[] | ParfinErrorRes> {
        const url = '/v1/api/custody/web3/contract';
        const response = await this.parfinHttp.makeRequest('GET', url, {});

        return response.data;
    }

    async registerContract(dto: ParfinRegisterContractDTO): Promise<ParfinRegisterContractSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/custody/web3/contract';
        const reqBody = dto;
        const response = await this.parfinHttp.makeRequest('POST', url, reqBody);
        return response.data;
    }

    async smartContractCall(
        dto: Pick<ParfinContractInteractDTO, 'metadata' | 'blockchainId'>,
    ): Promise<ParfinContractCallSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/custody/web3/contract/call';
        const reqBody = dto;
        const response = await this.parfinHttp.makeRequest('POST', url, reqBody);
        return response.data;
    }

    async smartContractSend(
        dto: Omit<ParfinContractInteractDTO, 'blockchainId'>,
    ): Promise<ParfinSuccessRes | ParfinErrorRes> {
        const url = '/v1/api/custody/web3/contract/send';
        const reqBody = dto;
        const response = await this.parfinHttp.makeRequest('POST', url, reqBody);
        return response.data;
    }

    //--- Transaction Endpoints
    async getAllTransactions(): Promise<ParfinGetAllTransactionsSuccessRes | ParfinErrorRes> {
        const url = `/v1/api/transaction/`;
        const data = await this.parfinHttp.makeRequest('GET', url, {});
        this.logger.log(data);
        return data.data as ParfinGetAllTransactionsSuccessRes;
    }

    async getTransactionById(id: string): Promise<ParfinGetTransactionSuccessRes | ParfinErrorRes> {
        const url = `/v1/api/transaction/${id}/`;
        const response = await this.parfinHttp.makeRequest('GET', url, {});
        return response.data;
    }

    async transactionSignAndPush(transactionId: string): Promise<any | ParfinErrorRes> {
        const url = `/v1/api/transaction/${transactionId}/sign-and-push`;
        const response = await this.parfinHttp.makeRequest('POST', url, {});
        return response.data;
    }
}
