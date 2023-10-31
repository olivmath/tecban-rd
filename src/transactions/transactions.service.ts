// transactions.service.ts
import { Injectable } from '@nestjs/common';
import { Transaction } from './transactions.schema';
import { TransactionDTO } from '../dtos/transaction.dto';
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
        let created: Transaction;
        try {
            created = await this.transactionsRepository.create(
                createTransactionDto,
            );
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao criar a transação!`);
        }
        return created;
    }

    async findAll(): Promise<Transaction[]> {
        let all: Transaction[];
        try {
            all = await this.transactionsRepository.findAll();
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao buscar todas as transações!`);
        }
        return all;
    }

    async findOne(id: string): Promise<Transaction> {
        let transaction: Transaction;
        try {
            transaction = await this.transactionsRepository.findOne(id);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao buscar a transação ${id}!`);
        }
        return transaction;
    }

    async update(
        id: string,
        updateTransactionDto: Partial<TransactionDTO>,
    ): Promise<Transaction> {
        try {
            let existingTransaction = await this.transactionsRepository.findOne(
                id,
            );

            if (!existingTransaction) {
                this.logger.error(
                    new Error(`Transação com ID ${id} não encontrada.`),
                );
                throw new Error(`Transação com ID ${id} não encontrada.`);
            }

            Object.assign(existingTransaction, updateTransactionDto);
            
            try {
                let updated = await this.transactionsRepository.update(
                    id,
                    existingTransaction,
                );
                return updated;
            } catch (error) {
                this.logger.error(error);
                throw new Error(`Erro ao atualizar o ID: ${id}`);
            }
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao buscar o ID: ${id}`);
        }
    }

    async remove(id: string): Promise<void> {
        try {
            await this.transactionsRepository.remove(id);
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao remover o ID: ${id}`);
        }
    }

    async transactionSignAndPush(
        id: string,
        dbTransactionId: string,
        interactionType: InteractionEnum = InteractionEnum.SEND,
    ) {
        if (interactionType !== InteractionEnum.CALL) {
            try {
                // Verificar se a transactionId existe no banco de dados
                const existingTransaction =
                    await this.transactionsRepository.findOne(dbTransactionId);

                if (!existingTransaction) {
                    this.logger.error(
                        new Error(`Transação com ID ${id} não encontrada.`),
                    );
                    throw new Error(`Transação com ID ${id} não encontrada.`);
                }

                // Chamar o transaction repository
                try {
                    await this.parfinService.transactionSignAndPush(id);

                    // Pegar a transação criada pela parfin
                    try {
                        const parfinTransaction =
                            await this.parfinService.getTransactionById(id);

                        // Update a transaction
                        const { blockchainNetwork, statusDescription } =
                            parfinTransaction as ParfinGetTransactionSuccessRes;

                        try {
                            await this.update(dbTransactionId, {
                                blockchainNetwork,
                                statusDescription,
                            });

                            // Retornar o status da transaction
                            return { statusDescription };
                        } catch (error) {
                            this.logger.error(error);
                            throw new Error(
                                `Erro ao atualizar a transação ${dbTransactionId}`,
                            );
                        }
                    } catch (error) {
                        this.logger.error(error);
                        throw new Error(
                            `Erro ao buscar a transação criada pela parfin: ${error.message}`,
                        );
                    }
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        `Erro ao chamar o transaction repository: ${error.message}`,
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro durante a interação com a transação: ${error.message}`,
                );
            }
        } else {
            try {
                await this.parfinService.transactionSignAndPush(id);
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao chamar o transaction repository: ${error.message}`,
                );
            }
        }
    }
}
