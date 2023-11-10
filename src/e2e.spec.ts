import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { TerminusModule } from '@nestjs/terminus';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { HealthController } from './health.controller';
import { ContractHelperModule } from './helpers/contract-helper/contract-helper.module';
import { LoggerModule } from './logger/logger.module';
import { ParfinModule } from './parfin/parfin.module';
import { RealDigitalModule } from './real-digital/real-digital.module';
import { RealTokenizadoModule } from './real-tokenizado/real-tokenizado.module';
import { TransactionsModule } from './transactions/transactions.module';
import { WalletModule } from './wallet/wallet.module';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('ParfinController', () => {
    let app: INestApplication;
    let mongod: MongoMemoryServer;

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

    describe('Gets Parfin', () => {
        it('/contracts (GET)', async () => {
            return await request(app.getHttpServer()).get('/parfin/contracts').expect(200);
        }, 10000);
        it('/wallets (GET)', async () => {
            return await request(app.getHttpServer()).get('/parfin/wallets').expect(200);
        }, 10000);
        it('/wallet/{id} (GET)', async () => {
            return await request(app.getHttpServer()).get('/parfin/wallet/01857d98-5079-4f0b-a24b-59f2973cb7c7').expect(200);
        }, 10000);
        it('/transactions (GET)', async () => {
            return await request(app.getHttpServer()).get('/parfin/transactions').expect(200);
        });
        it('/transaction/{id} (GET)', async () => {
            return await request(app.getHttpServer()).get('/parfin/transaction/ff078e4c-d765-4cc6-8bec-6fcd81d63eb2').expect(200);
            expect(2).toEqual(2);
        });
    });
});
