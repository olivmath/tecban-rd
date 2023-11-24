import { Module } from '@nestjs/common';
import { RealDigitalController } from './real-digital.controller';
import { RealDigitalService } from './real-digital.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
    imports: [ParfinModule, TransactionsModule],
    controllers: [RealDigitalController],
    providers: [RealDigitalService, ContractHelperService, LoggerService],
    exports: [RealDigitalService],
})
export class RealDigitalModule { }
