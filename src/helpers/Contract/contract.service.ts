import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';
import ContractWrapper from '../../utils/contract/contract-wrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Injectable } from '@nestjs/common';
import abiLoader from '../abi-loader';
import Web3 from 'web3';

export const discoveryAddress = process.env['ADDRESS_DISCOVERY_ADDRESS'];

export type ContractName =
    | 'RealDigitalDefaultAccount'
    | 'RealDigitalEnableAccount'
    | 'ApprovedDigitalCurrency'
    | 'SwapTwoStepsReserve'
    | 'ITPFtOperation1002'
    | 'ITPFtOperation1052'
    | 'AddressDiscovery'
    | 'RealTokenizado'
    | 'KeyDictionary'
    | 'SwapTwoSteps'
    | 'RealDigital'
    | 'SwapOneStep'
    | 'ITPFt'
    | 'STR';

@Injectable()
export class ContractHelperService {
    constructor(private readonly parfinService: ParfinService) { }

    // Função que busca todos os métodos de um contrato
    getContractMethods(contractName: ContractName): ContractWrapper {
        return new ContractWrapper(abiLoader[contractName]);
    }

    // Função que retorna o endereço de um contrato
    async getContractAddress(contractName: ContractName): Promise<string> {
        const w3 = new Web3();
        // build tx data to get address from addressDiscovery
        const pcw = new ContractWrapper(abiLoader['AddressDiscovery']);
        const data = pcw.addressDiscovery(w3.utils.sha3(contractName))[0];

        // mount Parfin's payload
        const payload = new ParfinContractInteractDTO();
        payload.metadata = {
            data: data,
            contractAddress: discoveryAddress,
        };

        // send tx via Parfin
        const result = await this.parfinService.smartContractCall(payload);

        // decode/return response
        return pcw.addressDiscovery({
            returned: result,
        })[0];
    }
}
