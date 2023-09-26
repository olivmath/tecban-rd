import { Module } from '@nestjs/common';
import { RealDigitalTokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { WalletModule } from './wallet/wallet.module';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsRepository } from './transactions/transactions.repository';
import { ParfinModule } from './parfin/parfin.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.DATABASE_URL),
    TerminusModule,
    WalletModule,
    TransactionsModule,
    RealDigitalTokenModule,
    ParfinModule,
  ],

  controllers: [HealthController],
})
export class AppModule {}
