import axios, { AxiosError, AxiosResponse } from 'axios';
import { LoggerService } from 'src/logger/logger.service';
import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
import base64 from 'base64-js';
import { AppError } from 'src/error/app.error';
import { ParfinSignAndPushRes } from 'src/res/app/parfin.responses';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

@Injectable()
export class ParfinHttpService {
    constructor(private readonly logger: LoggerService) {
        this.logger.setContext('ParfinHttpService');
    }

    private setAuthHeaders(apiUri: string, body: object | string): { 'x-api-key': string; Authorization: string } {
        dotenv.config();

        try {
            const encoder = new TextEncoder();

            const bytesApiSecret = encoder.encode(process.env.API_SECRET);
            const privateKey = process.env.PARFIN_PRIVATE_KEY;
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

            const bytesComputedBodyHexBase64 = base64.fromByteArray(bytesComputedBodyHex);

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

            const token =
                'Bearer ' +
                jwt.sign(payload, Buffer.from(privateKey64, 'base64').toString(), {
                    algorithm: algorithm,
                    header: {
                        alg: algorithm,
                        typ: tokenType,
                    },
                });

            return {
                'x-api-key': process.env.API_KEY,
                Authorization: token,
            };
        } catch (error) {
            throw new AppError(500, error.message, { erro: error });
        }
    }

    public async makeRequest(method: Method, apiUri: string, data: object): Promise<AxiosResponse> {
        const authHeaders = this.setAuthHeaders(apiUri, data);
        const headers = {
            headers: {
                'Content-Type': 'application/json',
                ...authHeaders,
            },
        };
        const url = process.env.PARFIN_API_V1_URL_SANDBOX + apiUri;
        try {
            const response = await axios.request({
                method,
                url,
                data,
                ...headers,
            });
            return response.data;
        } catch (error: any) {
            if (error instanceof AxiosError) {
                const status = error.response ? error.response.status : 500;
                const headersReqSecurityLog = {
                    Authorization: `${headers.headers.Authorization.slice(0, 12)}...`,
                    'x-api-key': `${headers.headers['x-api-key'].slice(0, 5)}...`,
                    'Content-Type': headers.headers['Content-Type'],
                };
                const parfinError = {
                    url,
                    response: {
                        body: error.response ? error.response.data : { message: error.message },
                        headers: error.response ? error.response.headers : {},
                        status,
                    },
                    request: {
                        body: data,
                        headers: headersReqSecurityLog,
                    },
                };
                throw new AppError(status, 'Erro ao chamar a Parfin', { parfinError });
            } else {
                throw new AppError(500, error.message);
            }
        }
    }

    async signPushTx(
        contractName: string,
        sendData: string,
        assetId: string,
        description: string,
    ): Promise<ParfinSignAndPushRes> {
        const contractAddress = ''; // mongo.getContractsAddressbyName(contractName)

        const contractSendBody = {
            description: description,
            customerTag: 'string',
            customerRefId: 'string',
            source: {
                AssetId: assetId,
            },
            metadata: {
                data: sendData,
                contractAddress: contractAddress,
            },
            priority: 'HIGH',
        };

        const responseSendTx = await this.makeRequest('POST', '/v1/api/custody/web3/contract/send', contractSendBody);

        const transactionId = responseSendTx.data.id;
        await this.makeRequest('POST', `/v1/api/transaction/${transactionId}/sign-and-push`, {});

        const responseTx = await this.makeRequest('POST', `/v1/api/transaction/${transactionId}`, {});
        return {
            status: responseTx.data.statusDescription,
            description: responseTx.data.description,
            txId: transactionId,
            parfinId: responseTx.data.parfinId,
            walletId: responseTx.data.walletId,
            blockchainId: responseTx.data.blockchainId,
            blockchainType: responseTx.data.blockchainNetwork,
            assetId: responseTx.data.assetId,
            assetType: responseTx.data.asset,
        };
    }
}
