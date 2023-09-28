// transactions.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDTO } from './dtos/transaction.dto';
import { Transaction } from './transactions.schema';

@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDTO: TransactionDTO,
  ): Promise<Transaction> {
    return this.transactionsService.update(id, updateTransactionDTO);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.transactionsService.remove(id);
  }
}
