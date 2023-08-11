// real-digital-token.service.ts

import { Injectable } from '@nestjs/common';
import { RealDigitalTokenRepository } from './rd-token.repository';
import { ContractDto, DeployContractDto, ResponseDeployContractDto } from './dto/rd-dto';

interface ISmartContractInteract {
  customerTag: string;
  customerRefId: string;
  description: string;
  metadata: Object;
  source: {
    assetId: string,
    walletId: string,
  };
  priority: string;
}

interface IService {
  contractId: string;
  data: ISmartContractInteract;
}

@Injectable()
export class RealDigitalTokenService {
  constructor(
    private readonly realDigitalTokenRepository: RealDigitalTokenRepository,
  ) { }

  // Função para realizar o deploy do contrato e retornar o ID do contrato e o hash da transação
  deployContract(deployContractDto: DeployContractDto): ResponseDeployContractDto {
    // Aqui você pode implementar a lógica para realizar o deploy do contrato
    // Por enquanto, vamos apenas simular o deploy e retornar um objeto com o ID do contrato e o hash da transação
    const contractId = 'CONTRACT_ID_EXAMPLE';
    const transactionHash = 'TRANSACTION_HASH_EXAMPLE';

    return {
      contractId,
      transactionHash,
    };
  }

  // Função para retornar uma lista do DTO ApiResponseDto
  async getAllContracts(): Promise<ContractDto[]> {
    const allContracts = await this.realDigitalTokenRepository.getAllContracts();
    return allContracts;
  }

  // TODO: Criar domínio cada tipo de ativo (Real Digital, Real Tokenizado, TPFt)
  // TODO: Adicionar os demais métodos de cada contrato

  // Função para emitir um ativo
  async mint({ contractId, data }: IService): Promise<any> {
    return await this.realDigitalTokenRepository.smartContractInteract(contractId, 'mint', data);
  }

  // Função para resgatar um ativo
  async burn({ contractId, data }: IService): Promise<any> {
    return await this.realDigitalTokenRepository.smartContractInteract(contractId, 'burn', data);
  }

  // Função para transferência de um ativo
  async transfer({ contractId, data }: IService): Promise<any> {
    return await this.realDigitalTokenRepository.smartContractInteract(contractId, 'transfer', data);
  }
}
