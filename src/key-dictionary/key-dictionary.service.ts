import { Injectable } from '@nestjs/common';
import { DecodeDataDTO } from 'src/dtos/contract-helper.dto';
import {
    KeyDictionaryAddAccountDTO,
    KeyDictionaryGetCustomerKeyDTO,
    KeyDictionaryGetCustomerWalletDTO,
} from 'src/dtos/key-dictionary.dto';
import { ParfinContractInteractDTO } from 'src/dtos/parfin.dto';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { DecodedDataResponse, DecodedKeyDictionaryGetCustomerResponse } from 'src/res/app/contract-helper.responses';
import Web3 from 'web3';

@Injectable()
export class KeyDictionaryService {
    keyDictionary: WrapperContractABI;

    constructor(
        private readonly contractHelper: ContractHelperService,
        private readonly logger: LoggerService,
        private readonly parfinService: ParfinService,
    ) {
        this.keyDictionary = this.contractHelper.getContractMethods('KEY_DICTIONARY');
        this.logger.setContext('KeyDictionaryService');
    }

    async addAccount(dto: KeyDictionaryAddAccountDTO) {
        const w3 = new Web3();

        const { description, taxId, bankNumber, account, branch, walletAddress } = dto;

        try {
            const keyDictionaryContractName = 'KEY_DICTIONARY';
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId, ...parfinSendDTO } = parfinDTO;
            parfinSendDTO.description = description;
            parfinSendDTO.source = { assetId: process.env.ARBI_RD_ASSET_ID };

            const { address } = this.contractHelper.getContractAddress(keyDictionaryContractName);
            if (!address) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${keyDictionaryContractName}`);
            }

            parfinSendDTO.metadata = {
                data: '',
                contractAddress: address,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };

            const clientKey = w3.utils.keccak256(taxId.toString());

            parfinSendDTO.metadata.data = this.keyDictionary[
                'addAccount(bytes32,uint256,uint256,uint256,uint256,address)'
            ](clientKey, Number(taxId), Number(bankNumber), Number(account), Number(branch), walletAddress)[0];

            // 3. Interagir com o contrato através do método smartContractSend
            const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
            const { id: transactionId } = parfinSendRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO);
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${keyDictionaryContractName}. Parfin Send DTO: ${payload}`,
                );
            }

            await this.parfinService.transactionSignAndPush(transactionId);

            return transactionId;
        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao adicionar os dados do cliente com CPF: ${taxId}`);
        }
    }

    async getCustomerData(dto) {
        const w3 = new Web3();
        const { taxId } = dto;
        try {
            const keyDictionaryContractName = 'KEY_DICTIONARY';
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId } = parfinDTO;
            const { address } = this.contractHelper.getContractAddress(keyDictionaryContractName);
            if (!address) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${keyDictionaryContractName}`);
            }

            const clientKey = w3.utils.keccak256(taxId.toString());

            const customerDataResponse = this.keyDictionary['getCustomerData(bytes32)'](clientKey)[0];

            const metadata = {
                contractAddress: address,
                data: customerDataResponse,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };

            const parfinCallDTO = {
                metadata,
                blockchainId,
            };

            // 3. Interagir com o contrato através do método smartContractCall
            const { data } = await this.parfinService.smartContractCall(parfinCallDTO);

            if (!data) {
                const payload = JSON.stringify(parfinCallDTO);
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${keyDictionaryContractName}. Parfin Send DTO: ${payload}`,
                );
            }

            const dataToDecode = {
                contractName: keyDictionaryContractName,
                functionName: 'getCustomerData',
                data,
            };

            const decodeDataRes = this.contractHelper.decodeData(dataToDecode);
            const { data: decodedData } = decodeDataRes as DecodedDataResponse;
            const getCustomerDataRes: DecodedKeyDictionaryGetCustomerResponse = Object(decodedData[0]);
            if (!getCustomerDataRes.taxId) {
                throw new Error(`[ERROR]: Erro ao decodificar os dados do contrato: ${dataToDecode}`);
            }

            return getCustomerDataRes;
        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao buscar os dados do cliente com CPF: ${taxId}`);
        }
    }

    async getCustomerKey(dto: KeyDictionaryGetCustomerKeyDTO) {
        const { walletAddress } = dto;
        try {
            const keyDictionaryContractName = 'KEY_DICTIONARY';
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId } = parfinDTO;
            const { address } = this.contractHelper.getContractAddress(keyDictionaryContractName);
            if (!address) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${keyDictionaryContractName}`);
            }

            const getKeyData = this.keyDictionary['getKey(address)'](walletAddress)[0];

            const metadata = {
                contractAddress: address,
                data: getKeyData,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };

            const parfinCallDTO = {
                metadata,
                blockchainId,
            };

            const { data } = await this.parfinService.smartContractCall(parfinCallDTO);

            if (!data) {
                const payload = JSON.stringify(parfinCallDTO);
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${keyDictionaryContractName}. Parfin Send DTO: ${payload}`,
                );
            }

            const dataToDecode: DecodeDataDTO = {
                contractName: keyDictionaryContractName,
                functionName: 'getKey',
                data,
            };

            const decodeDataRes = this.contractHelper.decodeData(dataToDecode);
            const { data: decodedData } = decodeDataRes as DecodedDataResponse;
            const getCustomerDataRes = decodedData[0];
            if (typeof getCustomerDataRes !== 'string') {
                throw new Error(`[ERROR]: Erro ao decodificar os dados do contrato: ${dataToDecode}`);
            }

            return { customerKey: getCustomerDataRes };
        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao buscar chave do cliente com a wallet: ${walletAddress}`);
        }
    }

    async getCustomerWallet(dto: KeyDictionaryGetCustomerWalletDTO) {
        const { key } = dto;
        try {
            const keyDictionaryContractName = 'KEY_DICTIONARY';
            const parfinDTO = new ParfinContractInteractDTO();
            const { blockchainId } = parfinDTO;
            const { address } = this.contractHelper.getContractAddress(keyDictionaryContractName);
            if (!address) {
                throw new Error(`[ERROR]: Erro ao buscar o contrato ${keyDictionaryContractName}`);
            }

            const getWalletData = this.keyDictionary['getWallet(bytes32)'](key)[0];

            const metadata = {
                contractAddress: address,
                data: getWalletData,
                from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
            };

            const parfinCallDTO = {
                metadata,
                blockchainId,
            };

            const { data } = await this.parfinService.smartContractCall(parfinCallDTO);

            if (!data) {
                const payload = JSON.stringify(parfinCallDTO);
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${keyDictionaryContractName}. Parfin Send DTO: ${payload}`,
                );
            }

            const dataToDecode: DecodeDataDTO = {
                contractName: keyDictionaryContractName,
                functionName: 'getKey',
                data,
            };

            const decodeDataRes = this.contractHelper.decodeData(dataToDecode);
            const { data: decodedData } = decodeDataRes as DecodedDataResponse;
            const getWalletDataRes = decodedData[0];
            if (typeof getWalletDataRes !== 'string') {
                throw new Error(`[ERROR]: Erro ao decodificar os dados do contrato: ${dataToDecode}`);
            }

            return { customerWallet: getWalletDataRes };
        } catch (error) {
            this.logger.error(error);
            throw new Error(`[ERROR]: Erro ao buscar carteira do cliente ${key}`);
        }
    }
}
