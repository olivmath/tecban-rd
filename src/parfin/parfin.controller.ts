import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParfinService } from './parfin.service';
import {
  ParfinDeployContractDTO,
  ParfinRegisterContractDTO,
  ParfinRegisterERC20TokenDTO,
} from './dtos/parfin.dto';
import {
  ParfinSuccessRes,
  ParfinRegisterContractSuccessRes,
  ParfinGetAllContractsSuccessRes,
  ParfinErrorRes,
  ParfinRegisterERC20TokenSuccessRes,
  ParfinGetWalletSuccessRes,
} from 'src/res/app/parfin.responses';
import { registerERC20Token200 } from 'src/res/swagger/parfin.swagger';
import { parfinError400, parfinError500 } from 'src/res/swagger/error.swagger';
import { getAllWallets200 } from 'src/res/swagger/wallet.swagger';

@Controller('parfin')
@ApiTags('Parfin Operations')
export class ParfinController {
  constructor(private readonly parfinService: ParfinService) { }

  @Post('contract/deploy')
  @ApiOperation({ summary: 'Deploy a smart contract', description: 'Deploy a smart contract using a Parfin API request' })
  async deployContract(
    @Body() dto: ParfinDeployContractDTO,
  ): Promise<ParfinSuccessRes | ParfinErrorRes> {
    return await this.parfinService.deployContract(dto);
  }

  @Post('contract/register')
  @ApiOperation({ summary: 'Register a smart contract', description: 'Register a smart contract for Parfin to listen to its events' })
  async registerContract(
    @Body() dto: ParfinRegisterContractDTO,
  ): Promise<ParfinRegisterContractSuccessRes | ParfinErrorRes> {
    return await this.parfinService.registerContract(dto);
  }

  @Get('contracts')
  @ApiOperation({ summary: 'Get all contracts', description: 'Get all smart contracts deployed using the Parfin API' })
  getAllContracts(): Promise<ParfinGetAllContractsSuccessRes[] | ParfinErrorRes> {
    return this.parfinService.getAllContracts();
  }

  @Post('token/register')
  @ApiOperation({ summary: 'Register new ERC20 token', description: 'Register a new ERC20 token inside the Parfin platform' })
  @registerERC20Token200
  @parfinError400
  @parfinError500
  registerERC20Token(@Body() dto: ParfinRegisterERC20TokenDTO): Promise<
    ParfinRegisterERC20TokenSuccessRes | ParfinErrorRes
  > {
    return this.parfinService.registerERC20Token(dto);
  }

  @Get('wallets')
  @ApiOperation({ summary: 'Get all Parfin wallets', description: 'Get all wallets registered in the Parfin platform' })
  @getAllWallets200
  @parfinError400
  @parfinError500
  getAllWallets(): Promise<
    ParfinGetWalletSuccessRes[] | ParfinErrorRes
  > {
    return this.parfinService.getAllWallets();
  }
}