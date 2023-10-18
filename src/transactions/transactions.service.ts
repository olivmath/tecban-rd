// transactions.service.ts
import { Injectable } from '@nestjs/common';
import { Transaction } from './transactions.schema';
import { TransactionDTO } from './dtos/transaction.dto';
import { TransactionsRepository } from './transactions.repository';
import { ParfinService } from 'src/parfin/parfin.service';
import { ParfinGetTransactionSuccessRes } from 'src/res/app/parfin.responses';
import { LoggerService } from 'src/logger/logger.service';

export enum InteractionEnum {
    CALL = 'Call',
    SEND = 'Send',
}

@Injectable()
export class TransactionsService {
    constructor(
        private readonly transactionsRepository: TransactionsRepository,
        private readonly parfinService: ParfinService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('TransactionsService');
    }

    async create(createTransactionDto: TransactionDTO): Promise<Transaction> {
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
        updateTransactionDto: Partial<TransactionDTO>,
    ): Promise<Transaction> {
        const existingTransaction = await this.transactionsRepository.findOne(
            id,
        );

        if (!existingTransaction) {
            this.logger.error(
                new Error(`Transação com ID ${id} não encontrada.`),
            );
            throw new Error(`Transação com ID ${id} não encontrada.`);
        }

        Object.assign(existingTransaction, updateTransactionDto);
        return this.transactionsRepository.update(id, existingTransaction);
    }

    async remove(id: string): Promise<void> {
        await this.transactionsRepository.remove(id);
    }

    async transactionSignAndPush(
        id: string,
        dbTransactionId: string,
        interactionType: InteractionEnum = InteractionEnum.SEND,
    ) {
        if (interactionType !== InteractionEnum.CALL) {
            //verificar se a transactionId existe no banco de dados
            const existingTransaction =
                await this.transactionsRepository.findOne(dbTransactionId);

            if (!existingTransaction) {
                this.logger.error(
                    new Error(`Transação com ID ${id} não encontrada.`),
                );
                throw new Error(`Transação com ID ${id} não encontrada.`);
            }

            //chamar o transaction repository
            await this.parfinService.transactionSignAndPush(id);

            //pegar a transação criada pela parfin
            const parfinTransaction =
                await this.parfinService.getTransactionById(id);

            //update a transaction
            const { blockchainNetwork, statusDescription } =
                parfinTransaction as ParfinGetTransactionSuccessRes;
            await this.update(dbTransactionId, {
                blockchainNetwork,
                statusDescription,
            });

            //retornar o status da transaction
            return { statusDescription };
        } else {
            await this.parfinService.transactionSignAndPush(id);
        }
    }
}
