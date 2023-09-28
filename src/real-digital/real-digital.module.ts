import { Module } from '@nestjs/common';
import { RealDigitalController } from './real-digital.controller';
import { RealDigitalService } from './real-digital.service';
import { ContractHelper } from 'src/helpers/contract';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinService } from 'src/parfin/parfin.service';

@Module({
  imports: [ParfinService, TransactionsModule],
  controllers: [RealDigitalController],
  providers: [RealDigitalService, ContractHelper],
})
export class RealDigitalModule { }
