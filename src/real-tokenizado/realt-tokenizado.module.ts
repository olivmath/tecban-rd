import { Module } from '@nestjs/common';
import { RealTokenizadoController } from './real-tokenizado.controller';
import { RealTokenizadoService } from './real-tokenizado.service';
import { RealDigitalTokenModule } from 'src/token/token.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ContractHelper } from 'src/helpers/contract';

@Module({
  imports: [RealDigitalTokenModule, TransactionsModule],
  controllers: [RealTokenizadoController],
  providers: [RealTokenizadoService, ContractHelper],
})
export class RealTokenizadoModule {}
