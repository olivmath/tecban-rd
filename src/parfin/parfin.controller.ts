import { Body, Controller, Post, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParfinService } from './parfin.service';
import {
  ParfinDeployContractDTO,
  ParfinDeployContractResDTO,
  ParfinRegisterContractDTO,
  ParfinRegisterContractResDTO,
  ParfinContractDTO,
} from './dtos/parfin.dto';

@Controller('parfin')
@ApiTags('Parfin Requests')
export class ParfinController {
  constructor(private readonly parfinService: ParfinService) { }

  // Rota para realizar o deploy de um contrato
  @Post('contract/deploy')
  async deployContract(
    @Body() deployContractDTO: ParfinDeployContractDTO,
  ): Promise<ParfinDeployContractResDTO> {
    return await this.parfinService.deployContract(deployContractDTO);
  }

  // Rota para realizar o registro de um contrato
  @Post('contract/register')
  async registerContract(
    @Body() registerContractDTO: ParfinRegisterContractDTO,
  ): Promise<ParfinRegisterContractResDTO> {
    return await this.parfinService.registerContract(registerContractDTO);
  }

  // Rota para obter uma listagem de contratos
  @Get('contracts')
  getAllContracts(): Promise<ParfinContractDTO[]> {
    return this.parfinService.getAllContracts();
  }
}
