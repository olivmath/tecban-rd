import { Module } from '@nestjs/common';
import { RealTokenizadoController } from './real-tokenizado.controller';
import { RealTokenizadoService } from './real-tokenizado.service';
import { ContractHelper } from 'src/helpers/contract';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinService } from 'src/parfin/parfin.service';

@Module({
  imports: [ParfinService, TransactionsModule],
  controllers: [RealTokenizadoController],
  providers: [RealTokenizadoService, ContractHelper],
})
export class RealTokenizadoModule { }
