import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';
import ParfinContractWrapper from '../ParfinContractWrapper';
import { ParfinService } from 'src/parfin/parfin.service';
import { Contract } from 'web3-eth-contract';
import { Injectable } from '@nestjs/common';
import abiLoader from '../abiLoader';
import Web3 from 'web3';
import { PreRequest } from '../pre-request';

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
export class ContractHelper {
    private web3: any;
    private contractAddress: string;
    private contract: Contract | any;
    constructor(private readonly parfinService: ParfinService) {
        this.web3 = new Web3();
    }

    public getWeb3(): Web3 {
        return this.web3;
    }

    public getContractAddress(): string {
        return this.contractAddress;
    }

    public getContract(): Contract | any {
        return this.contract;
    }

    setContract(abiInterface: Array<any>, contractAddress?: string) {
        if (contractAddress) {
        }
        this.contract = new this.web3.eth.Contract(
            abiInterface,
            contractAddress,
        );
        return this;
    }

    async addressDiscovery(contractName: ContractName): Promise<string> {
        const w3 = new Web3();
        // build tx data to get address from addressDiscovery
        const pcw = new ParfinContractWrapper(abiLoader[contractName]);
        const data = pcw.addressDiscovery(w3.utils.sha3(contractName))[0];

        // mount Parfin's payload
        const payload = new ParfinContractInteractDTO();
        payload.callMetadata = {
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
