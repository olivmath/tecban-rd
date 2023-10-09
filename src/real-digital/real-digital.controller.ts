import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  RealDigitalMintDTO,
  RealDigitalBurnDTO,
  RealDigitalTransferDTO,
} from './dtos/real-digital.dto';
import { RealDigitalService } from './real-digital.service';

@Controller('real-digital')
@ApiTags('Real Digital Operations')
export class RealDigitalController {
  constructor(private readonly realDigitalService: RealDigitalService) { }

  @Post('mint')
  @ApiOperation({ summary: 'Mint Real Digital', description: 'Mint Real Digital token to an enabled wallet' })
  mint(@Body() dto: RealDigitalMintDTO) {
    return this.realDigitalService.mint({ dto });
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn Real Digital', description: 'Burn Real Digital token from an enabled wallet' })
  burn(@Body() dto: RealDigitalBurnDTO) {
    this.realDigitalService.burn({ dto });
  }

  @Post('external-transfer')
  @ApiOperation({ summary: 'Tranfer Real Digital (External)', description: 'Transfer Real Digital token between different financial institutions' })
  transfer(@Body() dto: RealDigitalTransferDTO) {
    return this.realDigitalService.transfer({ dto });
  }
}
