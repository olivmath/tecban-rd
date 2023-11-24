import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TPFtService } from './tpft.service';
import {
  TPFtAuctionPlacementDTO,
  TPFtGetBalanceOfDTO,
  TPFtGetBalanceOfQuery,
  TPFtInstitutionBuyFromAnInstitutionDTO,
  TPFtInstitutionSellToAnInstitutionDTO,
  TPFtSetApprovalForAllDTO
} from 'src/dtos/tpft.dto';
import { getTpftBalance201, tradeTpft201 } from 'src/res/swagger/tpft.swagger';

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

  // --- Operation 1002: TPFt Public Liquidity
  @Post('auction-placement')
  @ApiOperation({ summary: 'Execute TPFt Public Liquidity', description: 'Receive TPFt from the STN to the default wallet' })
  auctionPlacement(@Body() dto: TPFtAuctionPlacementDTO) {
    return this.tpftService.auctionPlacement(dto);
  }

  // --- Operation 1052: Institution Buy and Sell TPFt

  // - Buy and Sell Between Institutions Using CNPJ
  @Post('trade/institution/buy-from-another-institution')
  @tradeTpft201
  @ApiOperation({ summary: 'Buy TPFt from and institution', description: 'Buy TPFt from another institution' })
  async institutionBuyTpftFromAnInstitution(dto: TPFtInstitutionBuyFromAnInstitutionDTO) {
    return this.tpftService.buyTpftFromAnInstitution(dto);
  }

  // - Buy and Sell Between Institutions Using CNPJ
  @Post('trade/institution/sell-to-another-institution')
  @tradeTpft201
  @ApiOperation({ summary: 'Sell TPFt to and institution', description: 'Sell TPFt to another institution' })
  async institutionSellTpftToAnInstitution(dto: TPFtInstitutionSellToAnInstitutionDTO) {
    return this.tpftService.sellTpftFromAnInstitution(dto);
  }
}