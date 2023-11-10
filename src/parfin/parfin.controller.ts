import { Body, Controller, Post, Get, Param, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParfinService } from './parfin.service';
import {
  ParfinRegisterContractDTO,
  ParfinRegisterERC20TokenDTO,
} from '../dtos/parfin.dto';
import {
  ParfinRegisterContractSuccessRes,
  ParfinGetAllContractsSuccessRes,
  ParfinRegisterERC20TokenSuccessRes,
  ParfinGetWalletSuccessRes,
  ParfinGetTransactionSuccessRes,
  ParfinGetAllTransactionsSuccessRes,
} from 'src/res/app/parfin.responses';
import { getWalletById200, registerERC20Token200 } from 'src/res/swagger/parfin.swagger';
import { parfinError400, parfinError500 } from 'src/res/swagger/error.swagger';
import { getAllWallets200 } from 'src/res/swagger/wallet.swagger';

@Controller('parfin')
@ApiTags('Parfin Operations')
export class ParfinController {
  getHttpServer(): any {
      throw new Error('Method not implemented.');
  }
  constructor(private readonly parfinService: ParfinService) { }

  //--- Contract Endpoints
  @Post('contract/register')
  @ApiOperation({ summary: 'Register a smart contract', description: 'Register a smart contract for Parfin to listen to its events' })
  async registerContract(
    @Body() dto: ParfinRegisterContractDTO,
  ): Promise<ParfinRegisterContractSuccessRes> {
    return await this.parfinService.registerContract(dto);
  }

  @Get('contracts')
  @ApiOperation({ summary: 'Get all contracts', description: 'Get all smart contracts deployed using the Parfin API' })
  getAllContracts(): Promise<ParfinGetAllContractsSuccessRes[]> {
    return this.parfinService.getAllContracts();
  }

  @Post('token/register')
  @ApiOperation({ summary: 'Register new ERC20 token', description: 'Register a new ERC20 token inside the Parfin platform' })
  @registerERC20Token200
  @parfinError400
  @parfinError500
  registerERC20Token(@Body() dto: ParfinRegisterERC20TokenDTO): Promise<
    ParfinRegisterERC20TokenSuccessRes
  > {
    return this.parfinService.registerERC20Token(dto);
  }

  //--- Wallet Endpoints
  @Get('wallets')
  @ApiOperation({ summary: 'Get all Parfin wallets', description: 'Get all wallets registered in the Parfin platform' })
  @getAllWallets200
  @parfinError400
  @parfinError500
  getAllWallets(): Promise<
    ParfinGetWalletSuccessRes[]
  > {
    return this.parfinService.getAllWallets();
  }

  @Get('wallet/:id')
  @ApiOperation({ summary: 'Get a Parfin wallet', description: 'Get a wallet by id registered in the Parfin platform' })
  @getWalletById200
  @parfinError400
  @parfinError500
  getWalletById(@Param('id') id: string): Promise<
    ParfinGetWalletSuccessRes
  > {
    return this.parfinService.getWalletById(id);
  }

  //--- Transaction Endpoints
  @Get('transactions')
  @ApiOperation({ summary: 'Get all Parfin transactions', description: 'Get all Parfin transactions, registered in the Parfin platform' })
  getAllTransactions(): Promise<
    ParfinGetAllTransactionsSuccessRes
  > {
    return this.parfinService.getAllTransactions();
  }

  @Get('transaction/:id')
  @ApiOperation({ summary: 'Get a Parfin transaction', description: 'Get a transaction by ID, registered in the Parfin platform' })
  getTransactionById(@Param('id') id: string): Promise<
    ParfinGetTransactionSuccessRes
  > {
    return this.parfinService.getTransactionById(id);
  }

  @Put('transaction/sign-and-push/:transactionId')
  @ApiOperation({ summary: 'Sign ans push a transaction', description: 'Sign a transaction using Parfin technology and push it to the blockchain' })
  transactionSignAndPush(@Param('transactionId') transactionId: string): Promise<any> {
    return this.parfinService.transactionSignAndPush(transactionId);
  }
}