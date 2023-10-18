import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { parfinApi } from 'src/config/parfin-api-client';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class PreRequest {
  constructor(
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('PreRequest');
  }

  // Função que autoriza as chamadas a API da Parfin
  async setAuthorizationToken(apiURI: string) {
    try {
      const headers = {
        apiKey: this.configService.get<string>('X_API_KEY'),
        apiSecret: this.configService.get<string>('API_SECRET'),
        privateKey: this.configService.get<string>('PRIVATE_KEY'),
        apiURI: `/v1/api${apiURI}`,
        notBefore: '5',
        issuer: this.configService.get<string>('ISSUER'),
        audience: this.configService.get<string>('AUDIENCE'),
        'Content-Type': 'application/json',
      };

      const response = await axios.post(
        'https://api.sandbox.parfin.io/v1/api/auth/token/generate/external',
        { headers },
      );

      const token = response.data;

      parfinApi.defaults.headers.common['Authorization'] = `${token}`;
      parfinApi.defaults.headers.common["x-api-key"] = headers.apiKey
    } catch (error) {
      this.logger.error(error)
      throw new Error(`Erro ao gerar o token de autorização!`);
    }
  }
}
