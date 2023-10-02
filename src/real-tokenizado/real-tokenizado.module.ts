import { Module } from '@nestjs/common';
import { RealTokenizadoController } from './real-tokenizado.controller';
import { RealTokenizadoService } from './real-tokenizado.service';
import { ContractHelper } from 'src/helpers/contract';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';

@Module({
  imports: [ParfinModule, TransactionsModule],
  controllers: [RealTokenizadoController],
  providers: [RealTokenizadoService, ContractHelper],
})
export class RealTokenizadoModule {}
