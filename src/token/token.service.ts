// real-digital-token.service.ts

import Web3 from 'web3';
import strABI from '../ABI/strABI.json';
import realDigitalABI from '../ABI/realDigitalABI.json';
import realDigitalDefaultAccountABI from '../ABI/realDigitalDefaultAccountABI.json';
import realTokenizadoABI from '../ABI/realTokenizadoABI.json';
import tpftABI from '../ABI/tpftABI.json';

import { Injectable } from '@nestjs/common';
import { TokenRepository } from './token.repository';

import { BurnDTO, MintDTO, TransferDTO } from './dto/token-dto';
import { IService } from 'src/interfaces/service';
import { ContractHelper } from 'src/helpers/contract';
import { parfinCallData, parfinSendData } from 'src/parfin/mock';
import {
  ContractDTO,
  DeployContractDTO,
  ResponseDeployContractDTO,
} from 'src/shared-dtos/contract';
import { ParfinService } from 'src/parfin/parfin.service';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly contractHelper: ContractHelper,
    private readonly parfinService: ParfinService,
  ) {}

  // Função para emitir um ativo
  async mint({ contractId, dto }: IService): Promise<any> {
    const { asset, amount, to } = dto as MintDTO;
    if (asset === 'rd') {
      await this.contractHelper.setContract(strABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.requestToMint(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.mint(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .contract.methods.mint(to, amount)
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
      await this.contractHelper.setContract(strABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.requestToBurn(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      tpftABI;
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.burn(amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        parfinSendData,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.burn(amount)
        .encodeABI();
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
      await this.contractHelper.setContract(
        realDigitalDefaultAccountABI,
        contractId,
      );
      // Buscar o endereço da carteira do destinatário usando o CNPJ da instituição
      parfinCallData.metadata = this.contractHelper
        .getContract()
        .methods.defaultAccount(cnpj)
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
      await this.contractHelper.setContract(realDigitalABI, contractId);
      const data = this.contractHelper
        .getContract()
        .methods.transfer(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'rt') {
      // Executar a transferência entre clientes da mesma instituição
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      const data = this.contractHelper
        .getContract()
        .methods.transfer(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      const data = this.contractHelper
        .getContract()
        .methods.transfer(to, amount)
        .encodeABI();
      const { transactionId } = await this.tokenRepository.smartContractSend(
        contractId,
        data,
      );
      return await this.tokenRepository.smartContractSignAndPush(transactionId);
    }
  }

  async getAllContracts(): Promise<ContractDTO[]> {
    const allContracts = await this.tokenRepository.getAllContracts();
    return allContracts;
  }

  async deployContract(deployContractDTO): Promise<ResponseDeployContractDTO> {
    return this.parfinService.deployContract(deployContractDTO);
  }
}
