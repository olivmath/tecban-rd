// real-digital-token.service.ts

import Web3 from 'web3';
import strABI from './ABI/strABI.json';
import realDigitalABI from './ABI/realDigitalABI.json';
import realDigitalDefaultAccountABI from './ABI/realDigitalDefaultAccountABI.json';
import realDigitalEnableAccountABI from './ABI/realDigitalEnableAccountABI.json';
import keyDictionaryABI from './ABI/keyDictionaryABI.json';
import realTokenizadoABI from './ABI/realTokenizadoABI.json';
import tpftABI from './ABI/tpftABI.json';
import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import { Contract } from 'web3-eth-contract';

import {
  BurnDTO,
  ContractDTO,
  DeployContractDTO,
  EnableWalletDTO,
  MintDTO,
  ResponseDeployContractDTO,
  TransferDTO,
} from './dto/token-dto';

interface IService {
  dto: MintDTO | BurnDTO | TransferDTO;
  contractId?: string;
}

const parfinSendData = {
  customerTag: 'lorem',
  customerRefId: 'lorem',
  description: 'lorem',
  metadata: {},
  source: {
    assetId: 'lorem',
    walletId: 'lorem',
  },
  priority: 'lorem',
};

const parfinCallData = {
  metadata: {},
  blockchainId: 'lorem',
};

@Injectable()
export class TokenService {
  private web3: Web3;
  private contractAddress: string;
  private contract: Contract | any;
  constructor(private readonly tokenRepository: TokenRepository) {
    // this.web3 = new Web3();
  }

  // Função para realizar o deploy do contrato e retornar o ID do contrato e o hash da transação
  deployContract(
    deployContractDTO: DeployContractDTO,
  ): ResponseDeployContractDTO {
    // Aqui você pode implementar a lógica para realizar o deploy do contrato
    // Por enquanto, vamos apenas simular o deploy e retornar um objeto com o ID do contrato e o hash da transação
    const contractId = 'CONTRACT_ID_EXAMPLE';
    const transactionHash = 'TRANSACTION_HASH_EXAMPLE';

    return {
      contractId,
      transactionHash,
    };
  }

  // Função para retornar uma lista do DTO ApiResponseDTO
  async getAllContracts(): Promise<ContractDTO[]> {
    const allContracts = await this.tokenRepository.getAllContracts();
    return allContracts;
  }

  setContract(abiInterface: Array<any>, contractAddress?: string) {
    if (contractAddress) {
    }
    this.contract = new this.web3.eth.Contract(abiInterface, contractAddress);
    return this;
  }

  // // Função para criar uma nova carteira do cliente
  // async createClientWallet({ contractId, dto }: IService): Promise<any> {
  //   //TODO: Implementar lógica para criação de uma nova carteira para um cliente com o contrato KeyDictionary.sol
  //   await this.setContract(keyDictionaryABI, contractId);
  //   parfinSendData.metadata = this.contract.methods.addAccount('lorem').encodeABI();
  //   const { transactionId } = await this.tokenRepository.smartContractSend(
  //     contractId,
  //     parfinSendData,
  //   );
  //   await this.tokenRepository.smartContractSignAndPush(transactionId);
  //   return await this.tokenRepository.createWallet(dto);
  // }

  // // Função para habilitar uma carteira
  // async enableWallet({ contractId, dto }: IService): Promise<any> {
  //   const { asset, address } = dto as EnableWalletDTO;
  //   if (asset === 'rd') {
  //     await this.setContract(realDigitalEnableAccountABI, contractId);
  //     parfinSendData.metadata = this.contract.methods
  //       .enableAccount(address)
  //       .encodeABI();
  //     const { transactionId } = await this.tokenRepository.smartContractSend(
  //       contractId,
  //       parfinSendData,
  //     );
  //     return await this.tokenRepository.smartContractSignAndPush(transactionId);
  //   } else if (asset === 'rt') {
  //     await this.setContract(realTokenizadoABI, contractId);
  //     parfinSendData.metadata = this.contract.methods
  //       .enableAccount(address)
  //       .encodeABI();
  //     const { transactionId } = await this.tokenRepository.smartContractSend(
  //       contractId,
  //       parfinSendData,
  //     );
  //     return await this.tokenRepository.smartContractSignAndPush(transactionId);
  //   } else if (asset === 'tpft') {
  //     await this.setContract(tpftABI, contractId);
  //     parfinSendData.metadata = this.contract.methods
  //       .enableAccount(address)
  //       .encodeABI();
  //     const { transactionId } = await this.tokenRepository.smartContractSend(
  //       contractId,
  //       parfinSendData,
  //     );
  //     return await this.tokenRepository.smartContractSignAndPush(transactionId);
  //   }
  // }

  // Função para emitir um ativo
  async mint({ contractId, dto }: IService): Promise<any> {
    const { asset, amount, to } = dto as MintDTO;
    if (asset === 'rd') {
      await this.setContract(strABI, contractId);
      parfinSendData.metadata = this.contract.methods
        .requestToMint(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      await this.setContract(realTokenizadoABI, contractId);
      parfinSendData.metadata = this.contract.methods
        .mint(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      await this.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contract.methods
        .mint(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }

  // Função para resgatar um ativo
  async burn({ contractId, dto }: IService): Promise<any> {
    const { asset, amount } = dto as BurnDTO;
    if (asset === 'rd') {
      await this.setContract(strABI, contractId);
      parfinSendData.metadata = this.contract.methods
        .requestToBurn(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      await this.setContract(realTokenizadoABI, contractId);
      tpftABI;
      parfinSendData.metadata = this.contract.methods.burn(amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      await this.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contract.methods.burn(amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }

  // Função para transferência de um ativo
  async transfer({ contractId, dto }: IService): Promise<any> {
    const { asset, cnpj, amount, to } = dto as TransferDTO;
    if (asset === 'rd') {
      await this.setContract(realDigitalDefaultAccountABI, contractId);
      // Buscar o endereço da carteira do destinatário usando o CNPJ da instituição
      parfinCallData.metadata = this.contract.methods
        .defaultAccount(cnpj)
        .encodeABI();
      const { realDigitalDefaultAccounttransactionId } =
        await this.tokenRepository.smartContractCall(
          contractId,
          parfinCallData,
        );
      await this.tokenRepository.smartContractSignAndPush(
        realDigitalDefaultAccounttransactionId,
      );
      // Executar a transferência entre instituições distintas
      await this.setContract(realDigitalABI, contractId);
      const data = this.contract.methods.transfer(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      // Executar a transferência entre clientes da mesma instituição
      await this.setContract(realTokenizadoABI, contractId);
      const data = this.contract.methods.transfer(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      await this.setContract(tpftABI, contractId);
      const data = this.contract.methods.transfer(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }
}
