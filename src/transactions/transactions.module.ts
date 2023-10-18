// transactions.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSchema } from './transactions.schema';
import { PreRequest } from 'src/helpers/pre-request';
import { TransactionsRepository } from './transactions.repository';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
  imports: [
    ParfinModule,
    MongooseModule.forFeature([
      {
        name: Transaction.name,
        schema: TransactionSchema,
        collection: 'Transactions',
      },
    ]),
  ],
  controllers: [TransactionsController],
  providers: [TransactionsService, PreRequest, TransactionsRepository, LoggerService],
  exports: [TransactionsService]
})
export class TransactionsModule { }
