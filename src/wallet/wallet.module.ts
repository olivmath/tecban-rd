import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { WalletController } from './wallet.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';
import { PreRequest } from 'src/helpers/pre-request';
import { TokenRepository } from 'src/token/token.repository';
import { ContractHelper } from 'src/helpers/contract';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema, collection: 'Wallet' },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository, PreRequest, ContractHelper, TokenRepository],
  exports: [WalletService],
})
export class WalletModule {}
