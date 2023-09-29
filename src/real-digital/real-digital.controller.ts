import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BurnDTO, MintDTO, TransferDTO } from 'src/token/dto/token-dto';
import { RealDigitalService } from './real-digital.service';

@Controller('real-digital')
@ApiTags('Real Digital')
export class RealDigitalController {
  constructor(private readonly realDigitalService: RealDigitalService) {}

  //Rota para executar a emissão do token
  @Post(':contractId/mint')
  mint(@Param('contractId') contractId: string, @Body() mintDTO: MintDTO) {
    // Chama o serviço para executar a emissão (mint)
    return this.realDigitalService.mint({ contractId, dto: mintDTO });
  }

  // Rota para executar o resgate do token
  @Post(':contractId/burn')
  burn(@Param('contractId') contractId: string, @Body() burnDTO: BurnDTO) {
    // Chama o serviço para executar o resgate (burn)
    this.realDigitalService.burn({ contractId, dto: burnDTO });
  }

  // Rota para executar a transferência do token
  @Post(':contractId/transfer')
  transfer(
    @Param('contractId') contractId: string,
    @Body() transferDTO: TransferDTO,
  ) {
    // Chama o serviço para lidar com a transferência
    return this.realDigitalService.transfer({ contractId, dto: transferDTO });
  }
}
