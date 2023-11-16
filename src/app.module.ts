import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
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
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerMiddleware } from './logger/logger.middleware';
import { RequestIdMiddleware } from './middleware/request-id.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
        MongooseModule.forRoot(process.env.DATABASE_URL),
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
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        },
    ],

    controllers: [HealthController],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestIdMiddleware, LoggerMiddleware).forRoutes('*');
    }
}
