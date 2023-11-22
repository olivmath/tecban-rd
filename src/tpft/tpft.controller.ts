import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TPFtService } from './tpft.service';
import { TPFtGetBalanceOfDTO, TPFtGetBalanceOfQuery, TPFtSetApprovalForAllDTO } from 'src/dtos/tpft.dto';
import { getTpftBalance201 } from 'src/res/swagger/tpft.swagger';

@Controller('tpft')
@ApiTags('TPFt Operations')
export class TPFtController {
  constructor(private readonly tpftService: TPFtService) { }

  @Post('set-approval')
  @ApiOperation({ summary: 'TPFt Set Approval', description: 'Set approval for an operator in the TPFt contract' })
  setApprovalForAll(@Body() dto: TPFtSetApprovalForAllDTO) {
    return this.tpftService.setApprovalForAll(dto);
  }

  @Get('balance/:address')
  @getTpftBalance201
  @ApiOperation({ summary: 'Get TPFt balance', description: 'Get a TPFt balance of a wallet' })
  @ApiParam({ name: 'address', example: '0x5be4C55e1977E555DB9a815a2CDed576A71Ca3c2' })
  balanceOf(@Param('address') address: string, @Query() tpftID: TPFtGetBalanceOfQuery) {
    const dto = { address, ...tpftID } as TPFtGetBalanceOfDTO;
    return this.tpftService.balanceOf(dto);
  }
}