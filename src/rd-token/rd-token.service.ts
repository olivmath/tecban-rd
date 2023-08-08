// real-digital-token.service.ts

import { Injectable } from '@nestjs/common';
import { RealDigitalTokenRepository } from './rd-token.repository';
import { ContractDto, DeployContractDto, ResponseDeployContractDto } from './dto/rd-dto';

@Injectable()
export class RealDigitalTokenService {
  constructor(
    private readonly realDigitalTokenRepository: RealDigitalTokenRepository,
  ) {}

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

  async mint(to: string, amount: number, contractId: string): Promise<any> {
    const data = {
      to,
      amount,
    };
    return await this.realDigitalTokenRepository.callSmartContract(contractId, 'mint', data);
  }

  async transfer(to: string, amount: number, contractId: string): Promise<any> {
    const data = {
      to,
      amount,
    };
    return await this.realDigitalTokenRepository.callSmartContract(contractId, 'transfer', data);
  }

  async burn(from: string, amount: number, contractId: string): Promise<any> {
    const data = {
      from,
      amount,
    };    
    return await this.realDigitalTokenRepository.callSmartContract(contractId, 'burn', data);
  }
}
