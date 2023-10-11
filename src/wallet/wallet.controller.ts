import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import {
    AccountCreateDTO,
  WalletCreateDTO,
  WalletEnableDTO,
} from './dto/wallet.dto';

@Controller('wallet')
@ApiTags('Wallet Operations')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('wallets')
  @ApiOperation({ summary: 'Get all', description: 'Get all wallets' })
  getAllWallets() {
    return this.walletService.getAllWallets();
  }

  @Get(':walletId')
  @ApiOperation({ summary: 'Get wallet by id', description: 'Get a single wallet by id' })
  getWalletById(walletId: string) {
    return this.walletService.getWalletById(walletId);
  }

  @Post('institution-create')
  @ApiOperation({ summary: 'Create an institution wallet', description: 'Create a wallet for a financial institution' })
  createInstitutionWallet(@Body() createInstitutuionWalletDTO: WalletCreateDTO) {
    return this.walletService.createInstitutionWallet({ dto: createInstitutuionWalletDTO });
  }

  @Post('client-create')
  @ApiOperation({ summary: 'Create a client wallet', description: 'Create a wallet for a client of a financial institution' })
  createClientWallet(@Body() createClientWalletDTO: AccountCreateDTO) {
    return this.walletService.createClientWallet({ dto: createClientWalletDTO });
  }

  @Post('enable')
  @ApiOperation({ summary: 'Enable a wallet', description: 'Enable a wallet to transact a specific asset' })
  enableWallet(@Body() dto: WalletEnableDTO) {
    return this.walletService.enableWallet({ dto });
  }
}
