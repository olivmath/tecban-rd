import { MongoMemoryServer } from 'mongodb-memory-server';
import { WalletController } from '../wallet.controller';
import { Test, TestingModule } from '@nestjs/testing';
import { MongooseModule } from '@nestjs/mongoose';
import { ParfinModule } from 'src/parfin/parfin.module';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { Wallet, WalletSchema } from '../wallet.schema';
import { WalletClientCreateDTO } from 'src/dtos/wallet.dto';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { WalletRepository } from '../wallet.repository';
import { WalletService } from '../wallet.service';
import { LoggerService } from 'src/logger/logger.service';
import { BlockchainId, WalletType } from 'src/types/wallet.types';
import { ParfinHttpService } from 'src/parfin/parfin.api.service';
import axios, { AxiosResponse } from 'axios';

describe('WalletController', () => {
    let controller: WalletController;
    let mongod: MongoMemoryServer;

    const client1 = new WalletClientCreateDTO();
    client1.blockchainId = BlockchainId.BLOCKCHAIN_ID;
    client1.walletType = WalletType.CUSTODY;
    client1.walletName = 'Lucas Oliveira';
    client1.taxId = "12345678901";
    client1.bankNumber = "123";
    client1.account = "987654";
    client1.branch = "4567";

    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ParfinModule,
                TransactionsModule,
                MongooseModule.forRoot(uri),
                MongooseModule.forFeature([{ name: Wallet.name, schema: WalletSchema, collection: 'Wallet' }]),
            ],
            controllers: [WalletController],
            providers: [WalletService, WalletRepository, ContractHelperService, LoggerService, ParfinHttpService],
        }).compile();

        controller = module.get<WalletController>(WalletController);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    describe('createClientWallet', () => {
        it('should create a client wallet', async () => {
            // Mock `ParfinHttpService.makeRequest` when call `createWallet`
            jest.spyOn(axios, 'request').mockResolvedValueOnce(
                Promise.resolve({
                    data: {
                        walletId: 'abcdef12-1234-4321-1234abcd4321',
                        address: '0x0000000000000000000000000000000000000001',
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {"Content-Type": "Test"},
                    config: {},
                } as AxiosResponse),
            );

            // Mock `ParfinHttpService.makeRequest` when call `KeyDictionary::addAccount`
            jest.spyOn(axios, 'request').mockResolvedValueOnce(
                Promise.resolve({
                    data: {
                        id: '497f6eca-6276-4993-bfeb-53cbbbba6f08',
                    },
                    status: 200,
                    statusText: 'OK',
                    headers: {"Content-Type": "Test"},
                    config: {},
                } as AxiosResponse),
            );
            const response = await controller.createClientWallet(client1);

            // Verifique se a resposta contém a mensagem 'ok'
            expect(response).toEqual({
                clientKey: '0x7ca3dc9a4a1c43a9fe8a03b17379006b526b1e0ae38dd9540c703c2ab990f385',
                wallet: '0x0000000000000000000000000000000000000001',
                parfinTxId: '497f6eca-6276-4993-bfeb-53cbbbba6f08',
                walletId: 'abcdef12-1234-4321-1234abcd4321',
            });
        });
    });
});
