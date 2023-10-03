import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
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
} from 'src/res/parfin.responses';

@Controller('parfin')
@ApiTags('Parfin Requests')
export class ParfinController {
  constructor(private readonly parfinService: ParfinService) { }

  // Rota para realizar o deploy de um contrato
  @Post('contract/deploy')
  async deployContract(
    @Body() dto: ParfinDeployContractDTO,
  ): Promise<ParfinSuccessRes | ParfinErrorRes> {
    return await this.parfinService.deployContract(dto);
  }

  // Rota para realizar o registro de um contrato
  @Post('contract/register')
  async registerContract(
    @Body() dto: ParfinRegisterContractDTO,
  ): Promise<ParfinRegisterContractSuccessRes | ParfinErrorRes> {
    return await this.parfinService.registerContract(dto);
  }

  // Rota para obter uma listagem de contratos
  @Get('contracts')
  getAllContracts(): Promise<ParfinGetAllContractsSuccessRes[] | ParfinErrorRes> {
    return this.parfinService.getAllContracts();
  }
}
