import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';

@Module({
  providers: [WalletService, WalletRepository],
})
export class WalletModule { }
