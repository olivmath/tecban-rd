import {
    ContractHelperGetContractSuccessRes,
    DecodedDataResponse,
    EncodedDataResponse,
} from 'src/res/app/contract-helper.responses';
import { LoggerService } from 'src/logger/logger.service';
import ContractWrapper from './contract-helper.wrapper';
import { AppError } from 'src/error/app.error';
import { BadRequestException, Injectable } from '@nestjs/common';
import abiLoader from '../abi-loader';
import * as dotenv from 'dotenv';
import WrapperContractABI from './contract-helper.wrapper';
import { DecodeDataDTO, EncodeDataDTO } from 'src/dtos/contract-helper.dto';
import { ParfinContractInteractDTO } from 'src/dtos/parfin.dto';
import { ParfinService } from 'src/parfin/parfin.service';
import { ParfinContractCallSuccessRes } from 'src/res/app/parfin.responses';
import Web3 from 'web3';

@Injectable()
export class ContractHelperService {
    addressDiscovery: WrapperContractABI;
    private readonly contracts: { [name: string]: string };
    constructor(
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService
    ) {
        this.logger.setContext('ContractHelperService');
        dotenv.config();

        this.contracts = {
            REAL_DIGITAL_DEFAULT_ACCOUNT: process.env.REAL_DIGITAL_DEFAULT_ACCOUNT_ADDRESS,
            REAL_DIGITAL_ENABLE_ACCOUNT: process.env.REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS,
            SWAP_TWO_STEP_RESERVE: process.env.SWAP_TWO_STEP_RESERVE_ADDRESS,
            ARBI_REAL_TOKENIZADO: process.env.REAL_TOKENIZADO_ARBI_ADDRESS,
            SWAP_ONE_STEP_FROM: process.env.SWAP_ONE_STEP_FROM_ADDRESS,
            ADDRESS_DISCOVERY: process.env.ADDRESS_DISCOVERY_ADDRESS,
            KEY_DICTIONARY: process.env.KEY_DICTIONARY_ADDRESS,
            SWAP_ONE_STEP: process.env.SWAP_ONE_STEP_ADDRESS,
            SWAP_TWO_STEP: process.env.SWAP_TWO_STEP_ADDRESS,
            REAL_DIGITAL: process.env.REAL_DIGITAL_ADDRESS,
            ITPFT_1002: process.env.TPFT_1002_ADDRESS,
            ITPFT_1052: process.env.TPFT_1052_ADDRESS,
            TPFT_DVP: process.env.TPFT_DVP_ADDRESS,
            ITPFT: process.env.TPFT_ADDRESS,
            STR: process.env.STR_ADDRESS,
        };
    }

    // Função que busca todos os métodos de um contrato
    getContractMethods(contractName: string): WrapperContractABI {
        const abi = abiLoader[contractName];
        return new ContractWrapper(abi, contractName);
    }

    // Função que retorna o endereço de um contrato
    getContractAddress(contractName: string): ContractHelperGetContractSuccessRes {
        const contractAddress = this.contracts[contractName];

        if (!contractAddress) {
            throw new AppError(500, `Invalid contract name: ${contractName}`);
        }
        return { address: contractAddress };
    }

    // Função que retorna o endereço de um contrato
    async getContractAddressFromBlockchain(contractName: string): Promise<
        ContractHelperGetContractSuccessRes
    > {
        const web3 = new Web3();
        this.addressDiscovery = this.getContractMethods('ADDRESS_DISCOVERY');
        const parfinDTO = new ParfinContractInteractDTO();
        const parfinCallDTO = {
            metadata: parfinDTO.metadata,
            blockchainId: parfinDTO.blockchainId,
        };

        parfinCallDTO.metadata = {
            data: '',
            contractAddress: process.env.ADDRESS_DISCOVERY_ADDRESS,
            from: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
        };

        const hashedContractName = web3.utils.keccak256(contractName);
        parfinCallDTO.metadata.data = this.addressDiscovery['addressDiscovery(bytes32)'](hashedContractName)[0];

        const parfinCallRes = await this.parfinService.smartContractCall(parfinCallDTO);
        const { data } = parfinCallRes as ParfinContractCallSuccessRes;
        if (!data) {
            const payload = JSON.stringify(parfinCallDTO);
            throw new Error(
                `[ERROR]: Erro ao tentar interagir com contrato AddressDiscovery. 
                    Parfin Call DTO: ${payload}`
            );
        }

        const contractAddress = this.addressDiscovery['addressDiscovery'](data)[0] as string;

        return { address: contractAddress };
    }

    encodeData(dto: EncodeDataDTO): EncodedDataResponse | BadRequestException {
        const { contractName, functionName, args } = dto;
        const contract = this.getContractMethods(contractName);
        const encodedData = contract[functionName](...args);

        return { data: encodedData };
    }

    decodeData(dto: DecodeDataDTO): DecodedDataResponse | BadRequestException {
        const { contractName, functionName, data } = dto;
        const contract = this.getContractMethods(contractName);
        const decodedData = contract[functionName](data);

        return { data: decodedData };
    }
}
