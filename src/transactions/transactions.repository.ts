// transactions.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './transactions.schema';
import { TransactionDTO } from './dtos/transaction.dto';
import { PreRequest } from 'src/helpers/pre-request';
import { parfinApi } from 'src/config/parfin-api-client';

@Injectable()
export class TransactionsRepository {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<Transaction>,
    private readonly preRequest: PreRequest,
  ) { }

  async create(
    createTransactionDto: TransactionDTO,
  ): Promise<Transaction> {
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

  // Função que chama API da Parfin para interagir com um contrato
  async transactionSignAndPush(id: string) {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/transaction/${id}/sign-and-push`;
      const response = await parfinApi.put(url, id);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar assinar a transação ${id}!`);
    }
  }

  async getTransactionById(id: string) {
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/transaction/${id}/`;
      const response = await parfinApi.get(url);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar solicitar a transação ${id}!`);
    }
  }
}
