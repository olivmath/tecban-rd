import { Injectable } from "@nestjs/common";
import * as crypto from 'crypto';
import base64 from 'base64-js';
import * as jwt from 'jsonwebtoken';
import { LoggerService } from 'src/logger/logger.service';
import { parfinApi } from 'src/config/parfin-api-client';

@Injectable()
export class ParfinAuth {
  constructor(
    private readonly logger: LoggerService
  ) {
    this.logger.setContext('ParfinAuth');
  }
  public async setAuth(
    apiUri: string,
    body: object | string,
  ): Promise<void> {
    try {
      const encoder = new TextEncoder();

      const bytesApiSecret = encoder.encode(process.env.API_SECRET);
      const privateKey = process.env.PRIVATE_KEY;
      const privateKey64 = btoa(privateKey);

      const companyNameIssuer = process.env.ISSUER;
      const algorithm = 'ES256';
      const tokenType = 'JWT';
      const audience = 'Parfin';
      const expirationTime = Math.floor(Date.now() / 1000) + 5 * 60;
      const issuedAt = Math.floor(Date.now() / 1000);
      const notBefore = Math.floor(Date.now() / 1000) - 3 * 60;

      const authBody = {
        apiUri: apiUri,
        serializedBody: body,
      };

      const formattedAuthBody = JSON.stringify(authBody);
      const bytesFormattedAuthBody = encoder.encode(formattedAuthBody);
      const computedBodyHex = crypto
        .createHmac('sha256', bytesApiSecret)
        .update(bytesFormattedAuthBody)
        .digest('hex');

      const bytesComputedBodyHex = encoder.encode(computedBodyHex);

      const bytesComputedBodyHexBase64 =
        base64.fromByteArray(bytesComputedBodyHex);

      const computedBodyHexBase64 = bytesComputedBodyHexBase64.toString();

      const payload = {
        iss: companyNameIssuer,
        aud: audience,
        exp: expirationTime,
        iat: issuedAt,
        nbf: notBefore,
        uri: apiUri,
        sub: process.env.API_KEY,
        bodyHash: computedBodyHexBase64,
      };

      const token = 'Bearer ' +
        jwt.sign(payload, Buffer.from(privateKey64, 'base64').toString(), {
          algorithm: algorithm,
          header: {
            alg: algorithm,
            typ: tokenType,
          },
        })

      parfinApi.defaults.headers.common['x-api-key'] = process.env.API_KEY;
      parfinApi.defaults.headers.common['Authorization'] = `${token}`;
    } catch (error) {
      this.logger.error(error)
      throw new Error('Erro ao gerar o token de autorização!');
    }
  }
}