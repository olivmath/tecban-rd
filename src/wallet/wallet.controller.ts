import { Body, Controller, Post, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import {
  CreateWalletDTO,
  EnableWalletDTO
} from '../token/DTO/token-DTO';

@Controller('wallet')
@ApiTags('Wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
  ) { }

  // Rota para criar uma nova carteira da instituição
  @Post('/wallet/institution-create')
  createInstitutionWallet(
    @Body() createWalletDTO: CreateWalletDTO,
  ) {
    // Chama o serviço para criar uma nova carteira
    return this.walletService.createInstitutionWallet({ dto: createWalletDTO });
  }

  // // Rota para criar uma nova carteira de um cliente
  // @Post('/wallet/client-create')
  // createClientWallet(
  //   @Body() createWalletDTO: CreateWalletDTO,
  // ) {
  //   // Chama o serviço para criar uma nova carteira
  //   return this.walletService.createClientWallet({ dto: createWalletDTO });
  // }

  // // Rota para habilitar uma nova
  // @Post('/wallet/enable')
  // enableWallet(
  //   @Param('contractId') contractId: string,
  //   @Body() enableWalletDTO: EnableWalletDTO,
  // ) {
  //   // Chama o serviço para habilitar uma carteira
  //   return this.walletService.enableWallet({ contractId, dto: enableWalletDTO });
  // }
}