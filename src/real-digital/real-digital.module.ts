import { Module } from '@nestjs/common';
import { RealDigitalController } from './real-digital.controller';
import { RealDigitalService } from './real-digital.service';
import { ContractService } from 'src/helpers/Contract/contract.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';

@Module({
    imports: [ParfinModule, TransactionsModule],
    controllers: [RealDigitalController],
    providers: [RealDigitalService, ContractService],
})
export class RealDigitalModule {}
