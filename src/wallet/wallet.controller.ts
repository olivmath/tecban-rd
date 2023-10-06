import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import {
  WalletCreateDTO,
  WalletEnableDTO,
} from './dto/wallet.dto';

@Controller('wallet')
@ApiTags('Wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Get('wallets')
  getAllWallets() {
    return this.walletService.getAllWallets();
  }

  @Get(':walletId')
  getWalletById(walletId: string) {
    return this.walletService.getWalletById(walletId);
  }

  // Rota para criar uma nova carteira da instituição
  @Post('institution-create')
  createInstitutionWallet(@Body() createInstitutuionWalletDTO: WalletCreateDTO) {
    // Chama o serviço para criar uma nova carteira

    return this.walletService.createInstitutionWallet({ dto: createInstitutuionWalletDTO });
  }

  // Rota para criar uma nova carteira de um cliente
  @Post('client-create')
  createClientWallet(@Body() dto: WalletCreateDTO) {
    // Chama o serviço para criar uma nova carteira
    return this.walletService.createClientWallet({ dto });
  }

  // Rota para habilitar uma nova
  @Post('enable')
  enableWallet(
    @Body() dto: WalletEnableDTO,
  ) {
    // Chama o serviço para habilitar uma carteira
    return this.walletService.enableWallet({ dto });
  }
}
