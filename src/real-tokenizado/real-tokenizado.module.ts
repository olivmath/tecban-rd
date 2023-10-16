import { Module } from '@nestjs/common';
import { RealTokenizadoController } from './real-tokenizado.controller';
import { RealTokenizadoService } from './real-tokenizado.service';

import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';
import { ContractService } from 'src/helpers/Contract/contract.service';

@Module({
    imports: [ParfinModule, TransactionsModule],
    controllers: [RealTokenizadoController],
    providers: [RealTokenizadoService, ContractService],
})
export class RealTokenizadoModule {}
