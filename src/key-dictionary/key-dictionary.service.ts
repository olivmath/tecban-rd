import { Injectable } from '@nestjs/common';
import { KeyDictionaryAddAccountDTO } from 'src/dtos/key-dictionary.dto';
import { ParfinContractInteractDTO } from 'src/dtos/parfin.dto';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { ParfinSuccessRes } from 'src/res/app/parfin.responses';
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

            const { address } = await this.contractHelper.getContractAddress(keyDictionaryContractName);
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

            // 3. ???
            const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
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
}
