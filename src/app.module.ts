import { Module } from '@nestjs/common';
import { RealDigitalTokenModule } from './token/token.module';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';
import { WalletModule } from './wallet/wallet.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TerminusModule,
    WalletModule,
    RealDigitalTokenModule,
  ],
  controllers: [HealthController],
})
export class AppModule { }
