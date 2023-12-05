import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletRepository } from './wallet.repository';
import { WalletController } from './wallet.controller';

import { MongooseModule } from '@nestjs/mongoose';
import { Wallet, WalletSchema } from './wallet.schema';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerService } from 'src/logger/logger.service';

@Module({
    imports: [
        ParfinModule,
        TransactionsModule,
        MongooseModule.forFeature([
            { name: Wallet.name, schema: WalletSchema, collection: 'Wallet' },
        ]),
    ],
    controllers: [WalletController],
    providers: [WalletService, WalletRepository, ContractHelperService, LoggerService],
    exports: [WalletService],
})
export class WalletModule { }
