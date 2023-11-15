import { ContractHelperGetContractSuccessRes } from 'src/res/app/contract-helper.responses';
import { ContractName } from 'src/types/contract-helper.types';
import { LoggerService } from 'src/logger/logger.service';
import ContractWrapper from './contract-helper.wrapper';
import { AppError } from 'src/error/app.error';
import { Injectable } from '@nestjs/common';
import abiLoader from '../abi-loader';
import * as dotenv from 'dotenv';

@Injectable()
export class ContractHelperService {
    private readonly contracts: { [name: string]: string };
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('ContractHelperService');
        dotenv.config();

        this.contracts = {
            REAL_DIGITAL_DEFAULT_ACCOUNT: process.env.REAL_DIGITAL_DEFAULT_ACCOUNT_ADDRESS,
            REAL_DIGITAL_ENABLE_ACCOUNT: process.env.REAL_DIGITAL_ENABLE_ACCOUNT_ADDRESS,
            SWAP_TWO_STEP_RESERVE: process.env.SWAP_TWO_STEP_RESERVE_ADDRESS,
            ARBI_REAL_TOKENIZADO: process.env.ARBI_REAL_TOKENIZADO_ADDRESS,
            SWAP_ONE_STEP_FROM: process.env.SWAP_ONE_STEP_FROM_ADDRESS,
            ADDRESS_DISCOVERY: process.env.ADDRESS_DISCOVERY_ADDRESS,
            KEY_DICTIONARY: process.env.KEY_DICTIONARY_ADDRESS,
            SWAP_ONE_STEP: process.env.SWAP_ONE_STEP_ADDRESS,
            SWAP_TWO_STEP: process.env.SWAP_TWO_STEP_ADDRESS,
            REAL_DIGITAL: process.env.REAL_DIGITAL_ADDRESS,
            TPFT_1002: process.env.TPFT_1002_ADDRESS,
            TPFT_1052: process.env.TPFT_1052_ADDRESS,
            TPFT_DVP: process.env.TPFT_DVP_ADDRESS,
            TPFT: process.env.TPFT_ADDRESS,
            STR: process.env.STR_ADDRESS,
        };
    }

    // Função que busca todos os métodos de um contrato
    getContractMethods(contractName: string): ContractWrapper {
        const abi = abiLoader[contractName];
        return new ContractWrapper(abi, contractName);
    }

    // Função que retorna o endereço de um contrato
    getContractAddress(contractName: ContractName): ContractHelperGetContractSuccessRes {
        const contractAddress = this.contracts[contractName];

        if (!contractAddress) {
            throw new AppError(500, 'Invalid contract name');
        }
        return { address: contractAddress };
    }
}
