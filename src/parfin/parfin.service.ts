import { Injectable } from '@nestjs/common';
import { parfinApi } from 'src/config/parfin-api-client';
import { PreRequest } from 'src/helpers/pre-request';
import {
  ParfinDeployContractDTO,
  ParfinDeployContractResDTO,
  ParfinRegisterContractDTO,
  ParfinRegisterContractResDTO,
  ParfinContractCallDTO,
  ParfinContractCallResDTO,
  ParfinContractSendDTO,
  ParfinContractSendResDTO,
  ParfinContractDTO,
} from './dtos/parfin.dto';
import { ParfinRepository } from './parfin.repository';

@Injectable()
export class ParfinService {
  constructor(
    private readonly preRequest: PreRequest,
    private readonly parfinRepository: ParfinRepository,

  ) { }

  // Função para realizar o deploy do contrato e retornar o ID do contrato e o hash da transação
  async deployContract(
    deployContractDTO: ParfinDeployContractDTO,
  ): Promise<ParfinDeployContractResDTO> {
    // Aqui você pode implementar a lógica para realizar o deploy do contrato
    // Por enquanto, vamos apenas simular o deploy e retornar um objeto com o ID do contrato e o hash da transação
    const contractId = 'CONTRACT_ID_EXAMPLE';
    const transactionHash = 'TRANSACTION_HASH_EXAMPLE';

    return {
      contractId,
      transactionHash,
    };
  }

  async registerContract(
    registerContractDTO: ParfinRegisterContractDTO
  ): Promise<ParfinRegisterContractResDTO> {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/custody/web3/contract`;
      const response = await parfinApi.post(url, registerContractDTO);
      return response.data;
    } catch (error) {
      throw new Error(
        `Erro ao tentar registrar com o contrato ${registerContractDTO.contractAddress}!`,
      );
    }
  }

  async getAllContracts(): Promise<ParfinContractDTO[]> {
    const allContracts = await this.parfinRepository.getAllContracts();
    return allContracts;
  }

  async smartContractCall(
    contractId, data: ParfinContractCallDTO
  ): Promise<ParfinContractCallResDTO> {
    return await this.parfinRepository.smartContractCall(contractId, data);
  }

  async smartContractSend(
    contractId: string, data: ParfinContractSendDTO
  ): Promise<ParfinContractSendResDTO> {
    return await this.parfinRepository.smartContractSend(contractId, data);
  }
}
