// real-digital-token.service.ts

import web3 from 'web3';
import strABI from './ABI/strABI.json';
import realDigitalABI from './ABI/realDigitalABI.json';
import realDigitalDefaultAccountABI from './ABI/realDigitalDefaultAccountABI.json';
import realDigitalEnableAccountABI from './ABI/realDigitalEnableAccountABI.json';
import keyDictionaryABI from './ABI/keyDictionaryABI.json';
import realTokenizadoABI from './ABI/realTokenizadoABI.json';
import tpftABI from './ABI/tpftABI.json';
import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';
import {
  BurnDTO,
  ContractDTO,
  CreateWalletDTO,
  DeployContractDTO,
  EnableWalletDTO,
  MintDTO,
  ResponseDeployContractDTO,
  TransferDTO
} from './DTO/token-DTO';

interface IService {
  dto:
  CreateWalletDTO |
  EnableWalletDTO |
  MintDTO |
  BurnDTO |
  TransferDTO
  ;
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
  constructor(
    private readonly tokenRepository: TokenRepository,
  ) { }

  // Função para realizar o deploy do contrato e retornar o ID do contrato e o hash da transação
  deployContract(deployContractDTO: DeployContractDTO): ResponseDeployContractDTO {
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
    const allContracts = await this.realDigitalTokenRepository.getAllContracts();
    return allContracts;
  }

  // Função para criar uma nova carteira da insituição
  async createInstitutionWallet({ dto }: IService): Promise<any> {
    return await this.tokenRepository.createWallet(dto);
  }

  // Função para criar uma nova carteira do cliente
  async createClientWallet({ contractId, dto }: IService): Promise<any> {
    //TODO: Implementar lógica para criação de uma nova carteira para um cliente com o contrato KeyDictionary.sol
    const contract = new web3.eth.Contract(keyDictionaryABI, contractId);
    parfinSendData.metadata = contract.methods.addAccount('lorem').encodeABI();
    const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
    await this.tokenRepository.smartContractSignAndPush(transactionId);
    return await this.tokenRepository.createWallet(dto);
  }

  // Função para habilitar uma carteira
  async enableWallet({ contractId, dto }: IService): Promise<any> {
    const { asset, address } = dto as EnableWalletDTO;
    if (asset === 'rd') {
      const contract = new web3.eth.Contract(realDigitalEnableAccountABI, contractId);
      parfinSendData.metadata = contract.methods.enableAccount(address).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      const contract = new web3.eth.Contract(realTokenizadoABI, contractId);
      parfinSendData.metadata = contract.methods.enableAccount(address).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      const contract = new web3.eth.Contract(tpftABI, contractId);
      parfinSendData.metadata = contract.methods.enableAccount(address).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }

  // Função para emitir um ativo
  async mint({ contractId, dto }: IService): Promise<any> {
    const { asset, amount, to } = dto as MintDTO;
    if (asset === 'rd') {
      const contract = new web3.eth.Contract(strABI, contractId);
      parfinSendData.metadata = contract.methods.requestToMint(amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      const contract = new web3.eth.Contract(realTokenizadoABI, contractId);
      parfinSendData.metadata = contract.methods.mint(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      const contract = new web3.eth.Contract(tpftABI, contractId);
      parfinSendData.metadata = contract.methods.mint(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }

  // Função para resgatar um ativo
  async burn({ contractId, dto }: IService): Promise<any> {
    const { asset, amount } = dto as BurnDTO;
    if (asset === 'rd') {
      const contract = new web3.eth.Contract(strABI, contractId);
      parfinSendData.metadata = contract.methods.requestToBurn(amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      const contract = new web3.eth.Contract(realTokenizadoABI, contractId);
      parfinSendData.metadata = contract.methods.burn(amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      const contract = new web3.eth.Contract(tpftABI, contractId);
      parfinSendData.metadata = contract.methods.burn(amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, parfinSendData);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }

  // Função para transferência de um ativo
  async transfer({ contractId, dto }: IService): Promise<any> {
    const { asset, cnpj, amount, to } = dto as TransferDTO;
    if (asset === 'rd') {
      // Buscar o endereço da carteira do destinatário usando o CNPJ da insituição
      const realDigitalDefaultAccount = new web3.eth.Contract(realDigitalDefaultAccountABI, contractId);
      parfinCallData.metadata = realDigitalDefaultAccount.methods.defaultAccount(cnpj).encodeABI();
      const { realDigitalDefaultAccounttransactionId } = await this.tokenRepository.smartContractCall(contractId, parfinCallData);
      await this.tokenRepository.smartContractSignAndPush(realDigitalDefaultAccounttransactionId);
      // Executar a transferência entre instituições distintas
      const contract = new web3.eth.Contract(realDigitalABI, contractId);
      const data = contract.methods.transfer(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, data);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      // Executar a transferência entre clientes da mesma instituição
      const contract = new web3.eth.Contract(realTokenizadoABI, contractId);
      const data = contract.methods.transfer(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, data);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      const contract = new web3.eth.Contract(tpftABI, contractId);
      const data = contract.methods.transfer(to, amount).encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(contractId, data);
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }
}
