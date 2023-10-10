import { Module } from '@nestjs/common';
import { RealDigitalController } from './real-digital.controller';
import { RealDigitalService } from './real-digital.service';
import { ContractHelper } from 'src/helpers/Contract/contract';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';

@Module({
    imports: [ParfinModule, TransactionsModule],
    controllers: [RealDigitalController],
    providers: [RealDigitalService, ContractHelper],
})
export class RealDigitalModule {}
