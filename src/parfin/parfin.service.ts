import { Injectable } from '@nestjs/common';
import { parfinApi } from 'src/config/parfin-api-client';
import { PreRequest } from 'src/helpers/pre-request';
import {
  DeployContractDTO,
  RegisterContractDTO,
  ResponseDeployContractDTO,
} from 'src/shared-dtos/contract';

@Injectable()
export class ParfinService {
  constructor(private readonly preRequest: PreRequest) {}

  // Função para realizar o deploy do contrato e retornar o ID do contrato e o hash da transação
  async deployContract(
    deployContractDTO: DeployContractDTO,
  ): Promise<ResponseDeployContractDTO> {
    // Aqui você pode implementar a lógica para realizar o deploy do contrato
    // Por enquanto, vamos apenas simular o deploy e retornar um objeto com o ID do contrato e o hash da transação
    const contractId = 'CONTRACT_ID_EXAMPLE';
    const transactionHash = 'TRANSACTION_HASH_EXAMPLE';

    return {
      contractId,
      transactionHash,
    };
  }

  async registerContract(registerContractDTO: RegisterContractDTO) {
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
}
