// transactions.controller.ts
import {
  Controller,
  Get,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { TransactionDTO } from './dtos/transaction.dto';
import { Transaction } from './transactions.schema';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('transactions')
@ApiTags('Transaction Operations')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) { }

  @Get()
  @ApiOperation({ summary: 'Get all', description: 'Get all transactions' })
  async findAll(): Promise<Transaction[]> {
    return this.transactionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get by id', description: 'Get a single transaction by id' })
  async findOne(@Param('id') id: string): Promise<Transaction> {
    return this.transactionsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update', description: 'Update a transaction by id' })
  async update(
    @Param('id') id: string,
    @Body() updateTransactionDTO: TransactionDTO,
  ): Promise<Transaction> {
    return this.transactionsService.update(id, updateTransactionDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete', description: 'Delete a transaction by id' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.transactionsService.remove(id);
  }
}
