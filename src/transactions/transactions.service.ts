// transactions.service.ts
import { Injectable } from '@nestjs/common';
import { Transaction } from './transactions.schema';
import { CreateTransactionDto } from './dtos/create-transaction.dto';
import { TransactionsRepository } from './transactions.repository';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<Transaction> {
    return this.transactionsRepository.create(createTransactionDto);
  }

  async findAll(): Promise<Transaction[]> {
    return this.transactionsRepository.findAll();
  }

  async findOne(id: string): Promise<Transaction> {
    return this.transactionsRepository.findOne(id);
  }

  async update(
    id: string,
    updateTransactionDto: Partial<CreateTransactionDto>,
  ): Promise<Transaction> {
    const existingTransaction = await this.transactionsRepository.findOne(id);

    if (!existingTransaction) {
      throw new Error(`Transação com ID ${id} não encontrada.`);
    }

    Object.assign(existingTransaction, updateTransactionDto);
    return this.transactionsRepository.update(id, existingTransaction);
  }

  async remove(id: string): Promise<void> {
    await this.transactionsRepository.remove(id);
  }

  async smartContractSignAndPush(id: string, dbTransactionId?: string) {
    //verificar se a transactionId existe no banco de dados
    const existingTransaction = await this.transactionsRepository.findOne(
      dbTransactionId,
    );

    if (!existingTransaction) {
      throw new Error(`Transação com ID ${id} não encontrada.`);
    }

    //chamar o transaction repository
    await this.transactionsRepository.smartContractSignAndPush(id);

    //pegar a transação criada pela parfin
    const parfinTransaction =
      await this.transactionsRepository.getSingleParfinTransaction(id);

    //update a transaction
    const { blockchainNetwork, statusDescription } = parfinTransaction;
    await this.update(dbTransactionId, {
      blockchainNetwork,
      statusDescription,
    });

    //retornar o status da transaction
    return { statusDescription };
  }

  async getSingleParfinTransaction(id: string) {
    return await this.transactionsRepository.getSingleParfinTransaction(id);
  }
}
