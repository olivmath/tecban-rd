import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoInternalTransferDTO,
} from '../dtos/real-tokenizado.dto';
import { RealTokenizadoService } from './real-tokenizado.service';

@Controller('real-tokenizado')
@ApiTags('Real Tokenizado Operations')
export class RealTokenizadoController {
  constructor(private readonly realTokenizadoService: RealTokenizadoService) { }

  @Post('mint')
  @ApiOperation({ summary: 'Mint Real Tokenizado', description: 'Mint Real Tokenizado token to an enabled wallet' })
  mint(@Body() dto: RealTokenizadoMintDTO) {
    return this.realTokenizadoService.mint(dto);
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn Real Tokenizado', description: 'Burn Real Tokenizado token from an enabled wallet' })
  burn(@Body() dto: RealTokenizadoBurnDTO) {
    this.realTokenizadoService.burn(dto);
  }

  @Post('internal-transfer')
  @ApiOperation({ summary: 'Tranfer Real Tokenizado (Internal)', description: 'Transfer Real Tokenizado token between clients from the same financial institution' })
  transfer(@Body() dto: RealTokenizadoInternalTransferDTO,) {
    return this.realTokenizadoService.internalTransfer(dto);
  }
}
