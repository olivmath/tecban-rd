import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import {
  CreateClientWalletDTO,
  CreateWalletDTO,
  EnableWalletDTO,
} from './dto/wallet-dto';

@Controller('wallet')
@ApiTags('Wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // Rota para criar uma nova carteira da instituição
  @Post('institution-create')
  createInstitutionWallet(@Body() createWalletDTO: CreateWalletDTO) {
    // Chama o serviço para criar uma nova carteira

    return this.walletService.createInstitutionWallet(createWalletDTO);
  }

  @Get()
  getAllWallets() {
    return this.walletService.getAllWallets();
  }

  // Rota para criar uma nova carteira de um cliente
  @Post('client-create')
  createClientWallet(@Body() createClientWalletDTO: CreateClientWalletDTO) {
    // Chama o serviço para criar uma nova carteira
    return this.walletService.createClientWallet(createClientWalletDTO);
  }

  // Rota para habilitar uma nova
  @Post('enable')
  enableWallet(
    @Param('contractId') contractId: string,
    @Body() enableWalletDTO: EnableWalletDTO,
  ) {
    // Chama o serviço para habilitar uma carteira
    return this.walletService.enableWallet({
      contractId,
      dto: enableWalletDTO,
    });
  }
}
