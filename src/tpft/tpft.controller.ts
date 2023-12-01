import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TPFtService } from './tpft.service';
import {
  TPFfBuyDTO,
  TPFtAuctionPlacementDTO,
  TPFtBuyParticipantAndItsClientDTO,
  TPFtGetBalanceOfDTO,
  TPFtGetBalanceOfQuery,
  TPFtInstitutionBuyFromAnInstitutionDTO,
  TPFtInstitutionSellToAnInstitutionDTO,
  TPFtSellDTO,
  TPFtSellParticipantAndItsClientDTO,
  TPFtSetApprovalForAllDTO
} from 'src/dtos/tpft.dto';
import { getTpftBalance201, buyTpft201, sellTpft201, externalBuyTpft201 } from 'src/res/swagger/tpft.swagger';

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

  // - Buy TPFt from another institution using CNPJ
  @Post('trade/institution/buy-from-another-institution')
  @buyTpft201
  @ApiOperation({
    summary: 'Buy TPFt from and institution',
    description: 'Trade TPFt between two institutions (purchase operation)'
  })
  async institutionBuyTpftFromAnInstitution(@Body() dto: TPFtInstitutionBuyFromAnInstitutionDTO) {
    return this.tpftService.buyTpftFromAnInstitution(dto);
  }

  // - Sell TPFt from another institution using CNPJ
  @Post('trade/institution/sell-to-another-institution')
  @sellTpft201
  @ApiOperation({
    summary: 'Sell TPFt to and institution',
    description: 'Trade TPFt between two institutions (sale operation)'
  })
  async institutionSellTpftToAnInstitution(@Body() dto: TPFtInstitutionSellToAnInstitutionDTO) {
    return this.tpftService.sellTpftToAnInstitution(dto);
  }

  // --- Operation 1052: Customer Buy and Sell TPFt

  // - Buy TPFt from institution or its customer
  @Post('trade/buy-from-institution-or-its-customer')
  @buyTpft201
  @ApiOperation({
    summary: 'Buy TPFt from an institution or its customer',
    description: 'Trade TPFt inside the same institution (purchase operation)'
  })
  async buyTpftParticipantAndItsClient(@Body() dto: TPFtBuyParticipantAndItsClientDTO) {
    return this.tpftService.buyTpftParticipantAndItsClient(dto);
  }

  // - Sell TPFt to institution or its customer
  @Post('trade/sell-to-institution-or-its-customer')
  @sellTpft201
  @ApiOperation({
    summary: 'Sell TPFt to an institution or its customer',
    description: 'Trade TPFt inside the same institution (sale operation)'
  })
  async sellTpftParticipantAndItsClient(@Body() dto: TPFtSellParticipantAndItsClientDTO) {
    return this.tpftService.sellTpftParticipantAndItsClient(dto);
  }

  // - Buy TPFt from another institution (client_insitution_A -> institution_B)
  @Post('trade/customer/buy-from-another-institution')
  @externalBuyTpft201
  @ApiOperation({
    summary: 'A customer can purchase TPFt from another institution',
    description: 'Trade TPFt outside the institution (purchase operation)'
  })
  async buyTpftParticipantAndDifferentClient(@Body() dto: TPFfBuyDTO) {
    return this.tpftService.buyTpftParticipantAndDifferentClient(dto);
  }

  // - Sell TPFt to a client from another institution (institution_A -> client_institution_B)
  @Post('trade/institution/sell-to-customer-from-another-institution')
  @sellTpft201
  @ApiOperation({
    summary: 'An institution can sell TPFt to a client from another institution',
    description: 'Trade TPFt outside the institution (sale operation)'
  })
  async sellTpftParticipantAndDifferentClient(@Body() dto: TPFtSellDTO) {
    return this.tpftService.sellTpftParticipantAndDifferentClient(dto);
  }
}