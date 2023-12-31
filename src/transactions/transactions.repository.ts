// transactions.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transactions.schema';
import { TransactionDTO } from '../dtos/transaction.dto';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
  ) { }

  async create(createTransactionDto: TransactionDTO): Promise<Transaction> {
    const createdTransaction = new this.transactionModel(createTransactionDto);
    return createdTransaction.save();
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionModel.find().exec();
  }

  async findOne(id: string): Promise<Transaction> {
    return this.transactionModel.findOne({ id }).exec();
  }

  async update(
    id: string,
    updateTransactionDto: Partial<TransactionDTO>,
  ): Promise<Transaction> {
    return this.transactionModel
      .findOneAndUpdate({ id }, updateTransactionDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<Transaction> {
    return this.transactionModel.findOneAndDelete({ id }).exec();
  }
}
