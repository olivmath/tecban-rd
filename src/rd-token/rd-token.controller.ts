import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RealDigitalTokenService } from './rd-token.service';
import { ContractDto, DeployContractDto, ResponseDeployContractDto, ContractInteractionDto } from './dto/rd-dto';

@Controller('rd-token')
@ApiTags('Real Digital Token')
export class RealDigitalTokenController {
  constructor(
    private readonly realDigitalTokenService: RealDigitalTokenService,
  ) { }

  // Rota para realizar o deploy do contrato
  @Post('deploy')
  deployContract(
    @Body() deployContractDto: DeployContractDto
  ): ResponseDeployContractDto {
    return this.realDigitalTokenService.deployContract(deployContractDto);
  }

  // Rota para obter a lista do DTO ApiResponseDto
  @Get('contracts')
  getAllContracts() {
    return this.realDigitalTokenService.getAllContracts();
  }

  // Rota para interagir com o contrato com o método mint
  @Post(':contractId/mint')
  mint(
    @Param('contractId') contractId: string,
    @Body() mintDto: ContractInteractionDto,
  ) {
    // Chama o serviço para executar a emissão (mint)
    return this.realDigitalTokenService.mint({ contractId, data: mintDto });
  }

  // Rota para interagir com o contrato com o método burn
  @Post(':contractId/burn')
  burn(
    @Param('contractId') contractId: string,
    @Body() burnDto: ContractInteractionDto,
  ) {
    // Chama o serviço para executar o resgate (burn)
    this.realDigitalTokenService.burn({ contractId, data: burnDto });
  }

  // Rota para interagir com o contrato com o método transfer
  @Post(':contractId/transfer')
  transfer(
    @Param('contractId') contractId: string,
    @Body() transferDto: ContractInteractionDto,
  ) {
    // Chama o serviço para lidar com a transferência
    return this.realDigitalTokenService.transfer({ contractId, data: transferDto });
  }
}