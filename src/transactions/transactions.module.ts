// transactions.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';
import { Transaction, TransactionSchema } from './transactions.schema';
import { PreRequest } from 'src/helpers/pre-request';
import { TransactionsRepository } from './transactions.repository';
import { ParfinModule } from 'src/parfin/parfin.module';

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
  providers: [TransactionsService, PreRequest, TransactionsRepository],
  exports: [TransactionsService]
})
export class TransactionsModule { }
