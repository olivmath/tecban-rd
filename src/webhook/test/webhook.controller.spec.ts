import { CustomerSmartContractEventsDto } from '../dto/customer-smart-contract-events.dto';
import { ContractHelperModule } from 'src/helpers/contract-helper/contract-helper.module';
import { RealTokenizadoModule } from 'src/real-tokenizado/real-tokenizado.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { RealDigitalModule } from 'src/real-digital/real-digital.module';
import { AllExceptionsFilter } from 'src/filters/http-exception.filter';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { HealthController } from 'src/health.controller';
import { ParfinModule } from 'src/parfin/parfin.module';
import { WalletModule } from 'src/wallet/wallet.module';
import { LoggerModule } from 'src/logger/logger.module';
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TerminusModule } from '@nestjs/terminus';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import request from 'supertest';
import crypto from 'crypto';
import * as dotenv from 'dotenv';



describe('WebhookController', () => {
    dotenv.config();

    let app: INestApplication;
    let mongod: MongoMemoryServer;
    const secret = process.env.PARFIN_PRIVATE_KEY

    beforeAll(async () => {
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();
        const moduleRef: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
                MongooseModule.forRoot(uri),
                TerminusModule,
                ParfinModule,
                RealDigitalModule,
                RealTokenizadoModule,
                TransactionsModule,
                WalletModule,
                ContractHelperModule,
                LoggerModule,
            ],
            providers: [
                {
                    provide: APP_FILTER,
                    useClass: AllExceptionsFilter,
                },
            ],

            controllers: [HealthController],
        }).compile();

        app = moduleRef.createNestApplication();
        await app.init();
    }, 10000);

    afterAll(async () => {
        await app.close();
    }, 10000);

    it('should return 200 with valid signature', async () => {
        const payload: CustomerSmartContractEventsDto = {
            Id: 'c447699b-0324-4204-8ab1-53b2df33e3c7',
            CustomerId: '3ee0512c-2d89-4a91-aeb6-4b54acf0addd',
            CreatedAt: '2022-07-01T14:17:22.814Z',
            Event: 'Teste',
            BlockchainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            LastTimeUpdated: '2023-06-20T20:29:57.296Z',
            LogIndex: 'string',
            TraceKey: '78ce0610-6064-4a6d-82dc-21616f117669',
            SmartContract: '0x84326f3de67179b700c1455c5f807222c0c84ee4',
            TransactionHash: 'c447699b-0324-4204-8ab1-53b2df33e3c7',
        };

        const payloadJson = JSON.stringify(payload);
        const signature = generateHash(secret, payloadJson);

        const response = await request(app.getHttpServer())
            .post('/webhook')
            .set('x-webhook-signature', signature)
            .send(payload);

        expect(response.status).toBe(200);
        expect(response.text).toBe('Webhook received');
    });

    it('should return 400 with invalid signature', async () => {
        const payload: CustomerSmartContractEventsDto = {
            Id: 'c447699b-0324-4204-8ab1-53b2df33e3c7',
            CustomerId: '3ee0512c-2d89-4a91-aeb6-4b54acf0addd',
            CreatedAt: '2022-07-01T14:17:22.814Z',
            Event: 'Teste',
            BlockchainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
            LastTimeUpdated: '2023-06-20T20:29:57.296Z',
            LogIndex: 'string',
            TraceKey: '78ce0610-6064-4a6d-82dc-21616f117669',
            SmartContract: '0x84326f3de67179b700c1455c5f807222c0c84ee4',
            TransactionHash: 'c447699b-0324-4204-8ab1-53b2df33e3c7',
        };

        const payloadJson = JSON.stringify(payload);
        const signature = generateHash(secret, payloadJson)
        const response = await request(app.getHttpServer())
            .post('/webhook')
            .set('x-webhook-signature', signature)
            .send(payload);

        expect(response.status).toBe(400);
        expect(response.text).toBe('Invalid webhook signature');
    });

    // Helper function to generate HMAC-SHA256 hash
    function generateHash(secret: string, payload: string): string {
        const shaKeyBytes = Buffer.from(secret, 'utf-8');
        const hmac = crypto.createHmac('sha256', shaKeyBytes);
        hmac.update(payload);
        return hmac.digest('hex');
    }
});
