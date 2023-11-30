import { Module } from '@nestjs/common';
import { RealTokenizadoController } from './real-tokenizado.controller';
import { RealTokenizadoService } from './real-tokenizado.service';

import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { LoggerService } from 'src/logger/logger.service';

@Module({
    imports: [ParfinModule, TransactionsModule],
    controllers: [RealTokenizadoController],
    providers: [RealTokenizadoService, ContractHelperService, LoggerService],
    exports: [RealTokenizadoService]
})
export class RealTokenizadoModule { }
