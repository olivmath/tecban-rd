import { MongooseModuleOptions, MongooseOptionsFactory } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import * as mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { WalletModule } from './wallet/wallet.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { ParfinModule } from './parfin/parfin.module';
import { RealDigitalModule } from './real-digital/real-digital.module';
import { RealTokenizadoModule } from './real-tokenizado/real-tokenizado.module';
import { ContractHelperModule } from './helpers/contract-helper/contract-helper.module';
import { KeyDictionaryModule } from './key-dictionary/key-dictionary.module';
import { TPFtModule } from './tpft/tpft.module';
import { LoggerModule } from './logger/logger.module';
import { AllExceptionsFilter } from './filters/http-exception.filter';
import { APP_FILTER } from '@nestjs/core';
import { LoggerMiddleware } from './logger/logger.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';
import { WebhookController } from './webhook/webhook.controller';
import { WebhookModule } from './webhook/webhook.module';
import { WebhookValidationMiddleware } from './middleware/webhook-validation.middleware';

@Injectable()
export class MongoDBMemoryServerFactory implements MongooseOptionsFactory {
    private mongo: MongoMemoryServer;

    constructor() {}

    async createMongooseOptions(): Promise<MongooseModuleOptions> {
        this.mongo = await MongoMemoryServer.create();
        const mongoUri = this.mongo.getUri();
        const mongooseOptions: MongooseModuleOptions = {
            uri: mongoUri,
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };
        return mongooseOptions;
    }

    async closeMongoDBMemoryServer() {
        await this.mongo.stop();
        await mongoose.connection.close();
    }
}

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRootAsync({
            useClass: MongoDBMemoryServerFactory,
        }),
        TerminusModule,
        ParfinModule,
        RealDigitalModule,
        RealTokenizadoModule,
        TPFtModule,
        TransactionsModule,
        WalletModule,
        ContractHelperModule,
        KeyDictionaryModule,
        LoggerModule,
        WebhookModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],

    controllers: [HealthController, WebhookController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestIdMiddleware).forRoutes('*');
        consumer.apply(LoggerMiddleware).forRoutes('*');
        consumer.apply(WebhookValidationMiddleware).forRoutes('api/v1/webhook');
    }
}
