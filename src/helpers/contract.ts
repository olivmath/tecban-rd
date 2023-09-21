import { Injectable } from '@nestjs/common';

import Web3 from 'web3';
import { Contract } from 'web3-eth-contract';

@Injectable()
export class ContractHelper {
  private web3: any;
  private contractAddress: string;
  private contract: Contract | any;
  constructor() {
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
    this.contract = new this.web3.eth.Contract(abiInterface, contractAddress);
    return this;
  }
}
