import { ParfinContractInteractDTO } from '../../dtos/parfin.dto';
import ContractWrapper from '../../utils/contract-util/contract-wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import abiLoader from '../abi-loader';
import Web3 from 'web3';
import { LoggerService } from 'src/logger/logger.service';
import { ContractHelperGetContractSuccessRes } from 'src/res/app/contract-helper.responses';
import { ParfinContractCallSuccessRes, ParfinErrorRes } from 'src/res/app/parfin.responses';
import { ContractName } from 'src/types/contract-helper.types';

export const discoveryAddress = process.env.ADDRESS_DISCOVERY_ADDRESS;

@Injectable()
export class ContractHelperService {
    constructor(
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('ContractHelperService');
    }

    // Função que busca todos os métodos de um contrato
    getContractMethods(contractName: ContractName): ContractWrapper {
        return new ContractWrapper(abiLoader[contractName]);
    }

    // Função que retorna o endereço de um contrato
    async getContractAddress(contractName: ContractName): Promise<
        ContractHelperGetContractSuccessRes
    > {
        const w3 = new Web3();

        try {
            // build tx data to get address from addressDiscovery
            const contract = new ContractWrapper(abiLoader['AddressDiscovery']);
            const encodedData = contract.addressDiscovery(w3.utils.sha3(contractName))[0];

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
            const { data } = parfinCallRes as ParfinContractCallSuccessRes;
            if (!data) {
                const payload = JSON.stringify(parfinCallDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato ${contractName}. Parfin Call DTO: ${payload}`
                );
            }

            // decode response
            const address: string = contract.addressDiscovery({
                returned: data,
            })[0];

            return { address };
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao buscar o endereço do contrato: ${contractName}`,
            );
        }
    }

    isContractNameValid(contractName: string): boolean {
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

        return validContractNames.includes(contractName as ContractName);
    }
}
