import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  RealTokenizadoMintDTO,
  RealTokenizadoBurnDTO,
  RealTokenizadoInternalTransferDTO,
  RealTokenizadoApproveDTO,
  RealTokenizadoBurnFromDTO,
  RealTokenizadoExternalTransferDTO,
  RealTokenizadoIncreaseAllowanceDTO,
} from '../dtos/real-tokenizado.dto';
import { RealTokenizadoService } from './real-tokenizado.service';

@Controller('real-tokenizado')
@ApiTags('Real Tokenizado Operations')
export class RealTokenizadoController {
  constructor(private readonly realTokenizadoService: RealTokenizadoService) { }

  @Post('approve')
  @ApiOperation({ summary: 'Approve a transaction', description: 'Approve a Real Tokenizado transaction' })
  approve(@Body() dto: RealTokenizadoApproveDTO) {
    return this.realTokenizadoService.approve(dto);
  }

  @Post('mint')
  @ApiOperation({ summary: 'Mint Real Tokenizado', description: 'Mint Real Tokenizado token to an enabled wallet' })
  mint(@Body() dto: RealTokenizadoMintDTO) {
    return this.realTokenizadoService.mint(dto);
  }

  @Post('burn')
  @ApiOperation({ summary: 'Burn Real Tokenizado', description: 'Burn Real Tokenizado token from an enabled wallet' })
  burn(@Body() dto: RealTokenizadoBurnDTO) {
    return this.realTokenizadoService.burn(dto);
  }

  @Post('burn-from')
  @ApiOperation({ summary: 'Burn Real Tokenizado from a wallet', description: 'Burn Real Tokenizado token from a different wallet' })
  burnFrom(@Body() dto: RealTokenizadoBurnFromDTO) {
    return this.realTokenizadoService.burnFrom(dto);
  }

  @Post('internal-transfer')
  @ApiOperation({ summary: 'Transfer Real Tokenizado (Internal)', description: 'Transfer Real Tokenizado token between clients from the same financial institution' })
  internalTransfer(@Body() dto: RealTokenizadoInternalTransferDTO) {
    return this.realTokenizadoService.internalTransfer(dto);
  }

  @Post('external-transfer')
  @ApiOperation({ summary: 'Transfer Real Tokenizado (External)', description: 'Transfer Real Tokenizado token between clients from different financial institutions' })
  externalTransfer(@Body() dto: RealTokenizadoExternalTransferDTO) {
    return this.realTokenizadoService.externalTransfer(dto);
  }

  @Get('balance/:address')
  @ApiOperation({ summary: 'Get Real Tokenizado balance', description: 'Get Real Tokenizado balance from any address' })
  @ApiParam({ name: 'address', example: '0x5be4C55e1977E555DB9a815a2CDed576A71Ca3c2' })
  balanceOf(@Param('address') address: string) {
    return this.realTokenizadoService.balanceOf(address);
  }

  @Get('allowance/')
  @ApiOperation({
    summary: 'Get allowance',
    description: 'Get the allowed RT amount that an address is able to spend'
  })
  allowance(@Query('owner') owner: string, @Query('spender') spender: string) {
    return this.realTokenizadoService.allowance(owner, spender);
  }

  @Post('increase-allowance/:address')
  @ApiOperation({
    summary: 'Increase allowance',
    description: 'Increase the allowed RT amount that an address is able to spend'
  })
  increaseAllowance(@Body() dto: RealTokenizadoIncreaseAllowanceDTO) {
    return this.realTokenizadoService.increaseAllowance(dto);
  }
}
