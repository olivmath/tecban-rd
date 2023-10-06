import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RealDigitalMintDTO,
  RealDigitalBurnDTO,
  RealDigitalTransferDTO,
} from './dtos/real-digital.dto';
import { RealDigitalService } from './real-digital.service';

@Controller('real-digital')
@ApiTags('Real Digital Token')
export class RealDigitalController {
  constructor(private readonly realDigitalService: RealDigitalService) { }

  //Rota para executar a emissão do token
  @Post('rd/mint')
  mint(@Body() dto: RealDigitalMintDTO) {
    // Chama o serviço para executar a emissão (mint)
    return this.realDigitalService.mint({ dto });
  }

  // Rota para executar o resgate do token
  @Post('rd/burn')
  burn(@Body() dto: RealDigitalBurnDTO) {
    // Chama o serviço para executar o resgate (burn)
    this.realDigitalService.burn({ dto });
  }

  // Rota para executar a transferência do token
  @Post('rd/external-transfer')
  transfer(
    @Body() dto: RealDigitalTransferDTO,
  ) {
    // Chama o serviço para lidar com a transferência
    return this.realDigitalService.transfer({ dto });
  }
}
