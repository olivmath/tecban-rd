import { Module } from '@nestjs/common';
import { RealDigitalController } from './real-digital.controller';
import { RealDigitalService } from './real-digital.service';
import { ContractHelper } from 'src/helpers/contract';
import { RealDigitalTokenModule } from 'src/token/token.module';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [RealDigitalTokenModule, TransactionsModule],
  controllers: [RealDigitalController],
  providers: [RealDigitalService, ContractHelper],
})
export class RealDigitalModule {}
