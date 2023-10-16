import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ParfinService } from './parfin.service';
import {
  ParfinDeployContractDTO,
  ParfinRegisterContractDTO,
} from './dtos/parfin.dto';
import {
  ParfinSuccessRes,
  ParfinRegisterContractSuccessRes,
  ParfinGetAllContractsSuccessRes,
  ParfinErrorRes,
} from 'src/res/app/parfin.responses';

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
  @ApiOperation({ summary: 'Get all', description: 'Get all smart contracts deployed using the Parfin API' })
  getAllContracts(): Promise<ParfinGetAllContractsSuccessRes[] | ParfinErrorRes> {
    return this.parfinService.getAllContracts();
  }
}
