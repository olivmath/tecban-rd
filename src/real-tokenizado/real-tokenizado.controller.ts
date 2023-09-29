import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoTransferDTO
} from './dtos/real-tokenizado.dto';
import { RealTokenizadoService } from './real-tokenizado.service';

@Controller('real-tokenizado')
@ApiTags('Real Tokenizado Token')
export class RealTokenizadoController {
  constructor(private readonly realTokenizadoService: RealTokenizadoService) { }

  //Rota para executar a emissão do token
  @Post(':contractId/mint')
  mint(@Param('contractId') contractId: string, @Body() mintDTO: RealTokenizadoMintDTO) {
    // Chama o serviço para executar a emissão (mint)
    return this.realTokenizadoService.mint({ contractId, dto: mintDTO });
  }

  // Rota para executar o resgate do token
  @Post(':contractId/burn')
  burn(@Param('contractId') contractId: string, @Body() burnDTO: RealTokenizadoBurnDTO) {
    // Chama o serviço para executar o resgate (burn)
    this.realTokenizadoService.burn({ contractId, dto: burnDTO });
  }

  // Rota para executar a transferência do token
  @Post(':contractId/transfer')
  transfer(
    @Param('contractId') contractId: string,
    @Body() transferDTO: RealTokenizadoTransferDTO,
  ) {
    // Chama o serviço para lidar com a transferência
    return this.realTokenizadoService.transfer({ contractId, dto: transferDTO });
  }
}
