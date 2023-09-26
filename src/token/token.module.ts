import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { PreRequest } from 'src/helpers/pre-request';
import { ParfinService } from 'src/parfin/parfin.service';
import { ContractHelper } from 'src/helpers/contract';
import { TransactionsModule } from 'src/transactions/transactions.module';

@Module({
  imports: [TransactionsModule],
  controllers: [TokenController],
  providers: [
    TokenService,
    PreRequest,
    TokenRepository,
    ParfinService,
    ContractHelper,
  ],
  exports: [TokenService],
})
export class RealDigitalTokenModule {}
