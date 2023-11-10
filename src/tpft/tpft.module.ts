import { Module } from '@nestjs/common';
import { TPFtController } from './tpft.controller';
import { TPFtService } from './tpft.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [ParfinModule],
  controllers: [TPFtController],
  providers: [TPFtService, ContractHelperService, LoggerService],
})
export class TPFtModule { }
