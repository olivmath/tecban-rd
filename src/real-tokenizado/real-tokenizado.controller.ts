import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BurnDTO, MintDTO, TransferDTO } from 'src/token/dto/token-dto';
import { RealTokenizadoService } from './real-tokenizado.service';

@Controller('real-tokenizado')
@ApiTags('Real Tokenizado')
export class RealTokenizadoController {
  constructor(private readonly realTokenizado: RealTokenizadoService) {}

  //Rota para executar a emissão do token
  @Post(':contractId/mint')
  mint(@Param('contractId') contractId: string, @Body() mintDTO: MintDTO) {
    // Chama o serviço para executar a emissão (mint)
    return this.realTokenizado.mint({ contractId, dto: mintDTO });
  }

  // Rota para executar o resgate do token
  @Post(':contractId/burn')
  burn(@Param('contractId') contractId: string, @Body() burnDTO: BurnDTO) {
    // Chama o serviço para executar o resgate (burn)
    this.realTokenizado.burn({ contractId, dto: burnDTO });
  }

  // Rota para executar a transferência do token
  @Post(':contractId/transfer')
  transfer(
    @Param('contractId') contractId: string,
    @Body() transferDTO: TransferDTO,
  ) {
    // Chama o serviço para lidar com a transferência
    return this.realTokenizado.transfer({ contractId, dto: transferDTO });
  }
}
