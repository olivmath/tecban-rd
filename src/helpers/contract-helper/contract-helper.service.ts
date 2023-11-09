import { ParfinContractInteractDTO } from '../../dtos/parfin.dto';
import ContractWrapper from './contract-helper.wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import abiLoader from '../abi-loader';
import Web3 from 'web3';
import { LoggerService } from 'src/logger/logger.service';
import { ContractHelperGetContractSuccessRes } from 'src/res/app/contract-helper.responses';
import { ParfinContractCallSuccessRes, ParfinErrorRes } from 'src/res/app/parfin.responses';
import { ContractName } from 'src/types/contract-helper.types';
import { AppError } from 'src/error/app.error';

export const discoveryAddress = process.env.ADDRESS_DISCOVERY_ADDRESS;

@Injectable()
export class ContractHelperService {
    constructor(private readonly parfinService: ParfinService, private readonly logger: LoggerService) {
        this.logger.setContext('ContractHelperService');
    }

    // Função que busca todos os métodos de um contrato
    getContractMethods(contractName: ContractName): ContractWrapper {
        return new ContractWrapper(abiLoader[contractName]);
    }

    // Função que retorna o endereço de um contrato
    async getContractAddress(contractName: ContractName): Promise<ContractHelperGetContractSuccessRes> {
        const w3 = new Web3();
        // build tx data to get address from addressDiscovery
        const contract = new ContractWrapper(abiLoader.AddressDiscovery);
        const encodedData = contract['addressDiscovery(bytes32)'](w3.utils.keccak256(contractName))[0];

        // mount Parfin's payload
        const parfinDTO = new ParfinContractInteractDTO();
        const parfinCallDTO = {
            metadata: parfinDTO.metadata,
            blockchainId: parfinDTO.blockchainId,
        };

        parfinCallDTO.metadata = {
            data: encodedData,
            contractAddress: discoveryAddress,
        };

        // send tx via Parfin
        let parfinCallRes: ParfinContractCallSuccessRes | ParfinErrorRes;
        parfinCallRes = await this.parfinService.smartContractCall(parfinCallDTO);
        const data = parfinCallRes as ParfinContractCallSuccessRes;

        // decode response
        const address: string = contract['addressDiscovery'](data)[0];

        return { address };
    }

    isContractNameValid(contractName: string) {
        const validContractNames: ContractName[] = [
            'RealDigitalDefaultAccount',
            'RealDigitalEnableAccount',
            'ApprovedDigitalCurrency',
            'SwapTwoStepsReserve',
            'ITPFtOperation1002',
            'ITPFtOperation1052',
            'AddressDiscovery',
            'RealTokenizado',
            'KeyDictionary',
            'SwapTwoSteps',
            'RealDigital',
            'SwapOneStep',
            'ITPFt',
            'STR',
        ];

        if (!validContractNames.includes(contractName as ContractName)) {
            throw new AppError(500, 'Invalid contract name');
        }
    }
}
