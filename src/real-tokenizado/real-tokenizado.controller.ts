import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoInternalTransferDTO,
} from './dtos/real-tokenizado.dto';
import { RealTokenizadoService } from './real-tokenizado.service';

@Controller('real-tokenizado')
@ApiTags('Real Tokenizado Token')
export class RealTokenizadoController {
  constructor(private readonly realTokenizadoService: RealTokenizadoService) { }

  //Rota para executar a emissão do token
  @Post('rt/mint')
  mint(@Body() dto: RealTokenizadoMintDTO) {
    // Chama o serviço para executar a emissão (mint)
    return this.realTokenizadoService.mint({ dto });
  }

  // Rota para executar o resgate do token
  @Post('rt/burn')
  burn(@Body() dto: RealTokenizadoBurnDTO) {
    // Chama o serviço para executar o resgate (burn)
    this.realTokenizadoService.burn({ dto });
  }

  // Rota para executar a transferência do token entre clientes da mesma insituição
  @Post('rt/internal-transfer')
  transfer(@Body() dto: RealTokenizadoInternalTransferDTO,) {
    // Chama o serviço para lidar com a transferência
    return this.realTokenizadoService.internalTransfer({ dto });
  }
}
