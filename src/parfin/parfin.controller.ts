import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ParfinService } from './parfin.service';
import {
  DeployContractDTO,
  RegisterContractDTO,
  ResponseDeployContractDTO,
  ResponseRegisterContractDTO,
} from 'src/shared-dtos/contract';

@Controller('parfin')
@ApiTags('Parfin Requests')
export class ParfinController {
  constructor(private readonly parfinService: ParfinService) {}

  // Rota para realizar o deploy de um contrato
  @Post('contract/deploy')
  async deployContract(
    @Body() deployContractDTO: DeployContractDTO,
  ): Promise<ResponseDeployContractDTO> {
    return await this.parfinService.deployContract(deployContractDTO);
  }

  // Rota para realizar o registro de um contrato
  @Post('contract/register')
  async registerContract(
    @Body() registerContractDTO: RegisterContractDTO,
  ): Promise<ResponseRegisterContractDTO> {
    return await this.parfinService.registerContract(registerContractDTO);
  }
}
