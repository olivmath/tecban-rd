import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  RealDigitalDTO,
  RealDigitalTransferDTO,
} from '../dtos/real-digital.dto';
import { RealDigitalService } from './real-digital.service';

@Controller('real-digital')
@ApiTags('Real Digital Operations')
export class RealDigitalController {
  constructor(private readonly realDigitalService: RealDigitalService) { }

  @Post('mint')
  @ApiOperation({ summary: 'Mint Real Digital', description: 'Mint Real Digital token to an enabled wallet' })
  mint(@Body() dto: RealDigitalDTO) {
    return this.realDigitalService.mint(dto);
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn Real Digital', description: 'Burn Real Digital token from an enabled wallet' })
  burn(@Body() dto: RealDigitalDTO) {
    return this.realDigitalService.burn(dto);
  }

  @Post('external-transfer')
  @ApiOperation({ summary: 'Tranfer Real Digital (External)', description: 'Transfer Real Digital token between different financial institutions' })
  transfer(@Body() dto: RealDigitalTransferDTO) {
    return this.realDigitalService.transfer(dto);
  }

  @Get('balanceOf/:address')
  @ApiOperation({ summary: 'Real Digital balance', description: 'Real Digital balance of any address' })
  @ApiParam({ name: 'address', example: '0x5be4C55e1977E555DB9a815a2CDed576A71Ca3c2' })
  balanceOf(@Param('address') address: string) {
    return this.realDigitalService.balanceOf(address);
  }
}