import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { parfinApi } from 'src/config/parfin-api-client';

@Injectable()
export class PreRequest {
  constructor(private readonly configService: ConfigService) {}

  // Função que autoriza as chamadas a API da Parfin
  async setAuthorizationToken() {
    try {
      const headers = {
        apiKey: this.configService.get<string>('X_API_KEY'),
        apiSecret: this.configService.get<string>('API_SECRET'),
        privateKey: this.configService.get<string>('PRIVATE_KEY'),
        apiURI: this.configService.get<string>('API_URI'),
        notBefore: '5',
        issuer: this.configService.get<string>('ISSUER'),
        audience: this.configService.get<string>('AUDIENCE'),
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        'https://api-sandbox.parfin.dev/v1/api/auth/token/generate/external',
        { data: {} },
        { headers },
      );

      const token = response.data;

      parfinApi.defaults.headers.common['Authorization'] = `${token}`;
    } catch (error) {
      throw new Error('Erro ao gerar o token de autorização!');
    }
  }
}
