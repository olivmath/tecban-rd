import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  RealDigitalApproveDTO,
  RealDigitalDTO,
  RealDigitalIncreaseAllowanceDTO,
  RealDigitalTransferDTO,
} from '../dtos/real-digital.dto';
import { RealDigitalService } from './real-digital.service';
import { approve201 } from 'src/res/swagger/contract.swagger';

@Controller('real-digital')
@ApiTags('Real Digital Operations')
export class RealDigitalController {
  constructor(private readonly realDigitalService: RealDigitalService) { }

  @Post('approve')
  @approve201
  @ApiOperation({ summary: 'Approve a transaction', description: 'Approve a Real Digital transaction' })
  approve(@Body() dto: RealDigitalApproveDTO) {
    return this.realDigitalService.approve(dto);
  }

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

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get Real Digital balance', description: 'Get Real Digital balance from any address' })
  @ApiParam({ name: 'address', example: '0x5be4C55e1977E555DB9a815a2CDed576A71Ca3c2' })
  balanceOf(@Param('address') address: string) {
    return this.realDigitalService.balanceOf(address);
  }

  @Get('allowance/')
  @ApiOperation({
    summary: 'Get allowance',
    description: 'Get the allowed RD amount that an address is able to spend'
  })
  allowance(@Query('owner') owner: string, @Query('spender') spender: string) {
    return this.realDigitalService.allowance(owner, spender);
  }

  @Post('increase-allowance/:address')
  @ApiOperation({
    summary: 'Increase allowance',
    description: 'Increase the allowed RD amount that an address is able to spend'
  })
  increaseAllowance(@Body() dto: RealDigitalIncreaseAllowanceDTO) {
    return this.realDigitalService.increaseAllowance(dto);
  }
}