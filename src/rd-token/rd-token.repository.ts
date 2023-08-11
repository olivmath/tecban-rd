// real-digital-token.repository.ts

import { Injectable } from '@nestjs/common';
import { parfinApi } from './rd-api-client';
import { ConfigService } from '@nestjs/config';
import { ContractInteractionDto } from './dto/rd-dto';

@Injectable()
export class RealDigitalTokenRepository {
  constructor(private readonly configService: ConfigService) { }

  // Função que chama API da Parfin para listagem de contratos
  async getAllContracts(): Promise<any> {
    try {
      await this.setAuthorizationToken();
      const response = await parfinApi.get(`/custody/web3/contracts`);
      return response.data;
    } catch (error) {
      throw new Error('Erro ao listar os contratos!');
    }
  }

  // Função que chama API da Parfin para obter informações sobre um contrato
  async smartContractView(
    smartContractAddress: string,
    method: string,
    data: any,
  ) {
    try {
      await this.setAuthorizationToken();
      const url = `/custody/web3/contracts/${smartContractAddress}/view/${method}`;
      const response = await parfinApi.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar visualizar informações do contrato ${smartContractAddress}!`);
    }
  }

  // Função que chama API da Parfin para interagir com um contrato
  async smartContractInteract(
    smartContractAddress: string,
    method: string,
    data: ContractInteractionDto,
  ) {
    try {
      await this.setAuthorizationToken();
      const url = `/custody/web3/contracts/${smartContractAddress}/interact/${method}`;
      const response = await parfinApi.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar interagir com o contrato ${smartContractAddress}!`);
    }
  }

  // Função que autoriza as chamadas a API da Parfin
  async setAuthorizationToken() {
    try {
      const headers = {
        apiKey: this.configService.get<string>('X_API_KEY'),
        apiSecret: this.configService.get<string>('API_SECRET'),
        privateKey: this.configService.get<string>('PRIVATE_KEY'),
        notBefore: '5',
        issuer: this.configService.get<string>('ISSUER'),
        audience: this.configService.get<string>('AUDIENCE'),
        'Content-Type': 'application/json',
      };

      const response = await parfinApi.post(
        '/auth/token/generate/external',
        { data: {} },
        { headers },
      );

      const token = response.data.token;
      console.log('token', token);
      parfinApi.defaults.headers.common['Authorization'] = `${token}`;
    } catch (error) {
      throw new Error('Erro ao gerar o token de autorização!');
    }
  }
}
