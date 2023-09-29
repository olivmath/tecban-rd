// real-digital-token.repository.ts

import { Injectable } from '@nestjs/common';
import { parfinApi } from 'src/config/parfin-api-client';
import { PreRequest } from 'src/helpers/pre-request';

import {
  ParfinContractCallDTO,
  ParfinContractCallResDTO,
  ParfinContractSendDTO,
  ParfinContractSendResDTO,
  ParfinContractDTO,
} from './dtos/parfin.dto';

// TODO: Mapear a tipagem dos possíveis erros retornados pela API da Parfin

@Injectable()
export class ParfinRepository {
  constructor(private readonly preRequest: PreRequest) { }

  // Função que chama API da Parfin para listagem de contratos
  async getAllContracts(): Promise<ParfinContractDTO[] | any> {
    try {
      await this.preRequest.setAuthorizationToken();
      const response = await parfinApi.get(`/custody/web3/contracts`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('Erro ao listar os contratos!');
    }
  }

  // Função que chama API da Parfin para obter informações sobre um contrato
  async smartContractCall(
    smartContractAddress: string, data: ParfinContractCallDTO
  ): Promise<ParfinContractCallResDTO | any> {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/custody/web3/contract/call`;
      const response = await parfinApi.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(
        `Erro ao tentar visualizar informações do contrato ${smartContractAddress}!`,
      );
    }
  }

  // Função que chama API da Parfin para interagir com um contrato
  async smartContractSend(
    contractId: string, data: ParfinContractSendDTO
  ): Promise<ParfinContractSendResDTO | any> {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/custody/web3/contract/send`;
      const response = await parfinApi.post(url, data);

      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar interagir com o contrato ${contractId}!`);
    }
  }
}
