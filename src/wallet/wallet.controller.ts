import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import {
  WalletInstitutionCreateDTO,
  WalletClientCreateDTO,
  WalletEnableDTO,
  WalletNewAssetDTO,
} from './dto/wallet.dto';
import { createWallet201, enableWallet200, getAllWallets200, getWalletById200, newAssetAdded201 } from 'src/res/swagger/wallet.swagger';
import { parfinError400, parfinError500 } from 'src/res/swagger/error.swagger';

@Controller('wallet')
@ApiTags('Wallet Operations')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

    @Get()
    @ApiOperation({ summary: 'Get all', description: 'Get all wallets' })
    @getAllWallets200
    @parfinError400
    @parfinError500
    getAllWallets() {
        return this.walletService.getAllWallets();
    }

  @Get(':walletId')
  @ApiOperation({ summary: 'Get wallet by id', description: 'Get a single wallet by id' })
  @getWalletById200
  @parfinError400
  @parfinError500
  getWalletById(@Param('walletId') walletId: string) {
    return this.walletService.getWalletById(walletId);
  }

  @Post('institution-create')
  @ApiOperation({
    summary: 'Create an institution wallet',
    description: 'Create a wallet for a financial institution'
  })
  @createWallet201
  @parfinError400
  @parfinError500
  createInstitutionWallet(@Body() dto: WalletInstitutionCreateDTO) {
    return this.walletService.createInstitutionWallet(dto);
  }

  @Post('client-create')
  @ApiOperation({
    summary: 'Create a client wallet',
    description: 'Create a wallet for a client of a financial institution'
  })
  @createWallet201
  @parfinError400
  @parfinError500
  createClientWallet(@Body() dto: WalletClientCreateDTO) {
    return this.walletService.createClientWallet(dto);
  }

  @Post('enable')
  @ApiOperation({
    summary: 'Enable a wallet',
    description: 'Enable a wallet to transact a specific asset'
  })
  @enableWallet200
  enableWallet(@Body() dto: WalletEnableDTO) {
    return this.walletService.enableWallet(dto);
  }

  @Post('add-asset')
  @ApiOperation({
    summary: 'Add asset',
    description: 'Add a new asset in a wallet to consult balance and etc...'
  })
  @newAssetAdded201
  @parfinError400
  @parfinError500
  addNewAsset(@Body() dto: WalletNewAssetDTO) {
    return this.walletService.addNewAsset(dto);
  }
}
