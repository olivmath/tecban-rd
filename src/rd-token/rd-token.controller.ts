import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { RealDigitalTokenService } from './rd-token.service';
import { BurnDto, ContractDto, DeployContractDto, MintDto, ResponseDeployContractDto, TransferDto } from './dto/rd-dto';

@Controller('rd-token')
@ApiTags('Real Digital Token')
export class RealDigitalTokenController {
  constructor(
    private readonly realDigitalTokenService: RealDigitalTokenService,
  ) {}

  // Rota para realizar o deploy do contrato
  @Post('deploy')
  deployContract(@Body() deployContractDto: DeployContractDto): ResponseDeployContractDto {
    return this.realDigitalTokenService.deployContract(deployContractDto);
  }
    
  // Rota para obter a lista do DTO ApiResponseDto
  @Get('contracts')
  getAllContracts() {
    return this.realDigitalTokenService.getAllContracts();
  }

  @Post(':contractId/mint')
  mint(@Body() mintDto: MintDto, @Param('contractId') contractId: string) {
    // Chama o serviço para lidar com a transferência
    return this.realDigitalTokenService.mint(mintDto.to, mintDto.amount, contractId);
  }
    
  @Post(':contractId/transfer')
  transfer(@Body() transferEventDto: TransferDto, @Param('contractId') contractId: string) {
    // Chama o serviço para lidar com a transferência
    return this.realDigitalTokenService.transfer(
      transferEventDto.to,
      transferEventDto.amount,
      contractId
    );
  }

  @Post(':contractId/burn')
  burn(@Body() burnEventDto: BurnDto, @Param('contractId') contractId: string) {
    // Chama o serviço para executar a queima (burn)
    this.realDigitalTokenService.burn(burnEventDto.from, burnEventDto.amount, contractId);
  }
}