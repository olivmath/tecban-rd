// real-digital-token.repository.ts

import { Injectable } from '@nestjs/common';
import { parfinApi } from 'src/config/parfin-api-client';
import { ContractCallDTO, ContractSendDTO } from './dto/token-dto';
import { Wallet } from '../wallet/wallet.schema';
import { PreRequest } from 'src/util/pre-request';

@Injectable()
export class TokenRepository {
  constructor(private readonly preRequest: PreRequest) {}

  // Função que chama API da Parfin para listagem de contratos
  async getAllContracts(): Promise<any> {
    try {
      await this.preRequest.setAuthorizationToken();
      const response = await parfinApi.get(`/custody/web3/contracts`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar os contratos!');
    }
  }

  // Função que chama API da Parfin para obter informações sobre um contrato
  async smartContractCall(smartContractAddress: string, data: ContractCallDTO) {
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
  async smartContractSend(contractId: string, data: ContractSendDTO) {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/custody/web3/contract/send`;
      const response = await parfinApi.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar interagir com o contrato ${contractId}!`);
    }
  }

  // Função que chama API da Parfin para interagir com um contrato
  async smartContractSignAndPush(transactionId: string) {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/transaction/${transactionId}/sign-and-push`;
      const response = await parfinApi.put(url, transactionId);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar assinar a transação ${transactionId}!`);
    }
  }
}
