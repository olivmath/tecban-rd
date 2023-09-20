import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { WalletController } from './wallet.controller';
import { PreRequest } from 'src/util/pre-request';
import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Wallet.name, schema: WalletSchema, collection: 'Wallet' },
    ]),
  ],
  controllers: [WalletController],
  providers: [WalletService, WalletRepository, PreRequest],
  exports: [WalletService],
})
export class WalletModule {}
