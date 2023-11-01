import { MongoMemoryServer } from "mongodb-memory-server";
import { WalletController } from "../wallet.controller";
import { Test, TestingModule } from "@nestjs/testing";
import { MongooseModule } from "@nestjs/mongoose";
import { ParfinModule } from "src/parfin/parfin.module";
import { TransactionsModule } from "src/transactions/transactions.module";
import { Wallet, WalletSchema } from "../wallet.schema";
import { WalletClientCreateDTO } from "src/dtos/wallet.dto";
import { ContractHelperService } from "src/helpers/contract-helper/contract-helper.service";
import { WalletRepository } from "../wallet.repository";
import { WalletService } from "../wallet.service";
import { LoggerService } from "src/logger/logger.service";
import { BlockchainId, WalletType } from "src/types/wallet.types";
import { parfinApi } from "src/config/parfin-api-client";

describe('WalletController', () => {
    let controller: WalletController;
    let mongod: MongoMemoryServer;


    const client1 = new WalletClientCreateDTO()
    client1.blockchainId = BlockchainId.BLOCKCHAIN_ID
    client1.walletType = WalletType.CUSTODY
    client1.walletName = 'Lucas Oliveira'
    client1.taxId = 12345678901
    client1.bankNumber = 123
    client1.account = 987654
    client1.branch = 4567

    const client2 = new WalletClientCreateDTO();
    client2.walletName = 'Yuri Correa';
    client2.blockchainId = BlockchainId.BLOCKCHAIN_ID;
    client2.walletType = WalletType.CUSTODY;
    client2.taxId = 98765432109;
    client2.bankNumber = 456;
    client2.account = 123789;
    client2.branch = 9876;


    const client3 = new WalletClientCreateDTO();
    client3.walletName = 'Samer Valente';
    client3.blockchainId = BlockchainId.BLOCKCHAIN_ID;
    client3.walletType = WalletType.CUSTODY;
    client3.taxId = 55555555505;
    client3.bankNumber = 789;
    client3.account = 456123;
    client3.branch = 1234;

    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ParfinModule,
                TransactionsModule, MongooseModule.forRoot(uri),
                MongooseModule.forFeature([
                    { name: Wallet.name, schema: WalletSchema, collection: 'Wallet' },
                ]),
            ],
            controllers: [WalletController],
            providers: [WalletService, WalletRepository, ContractHelperService, LoggerService],
        }).compile();

        controller = module.get<WalletController>(WalletController)
    });

    afterAll(async () => {
        await mongod.stop()
    });

    describe('createClientWallet', () => {
        it('should create a client wallet', async () => {
            // Mock `parfinApi.post` when call `createWallet`
            jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
                Promise.resolve({
                    data: {
                        walletId: "abcdef12-1234-4321-1234abcd4321",
                        address: "0x0000000000000000000000000000000000000001"
                    },
                }),
            );
            // Mock `parfinApi.post` when call `AddressDiscovery::addressDiscovery`
            jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
                Promise.resolve({
                    data: {
                        data: '0x00000000000000000000000060c48562056c6cfcd2128ce60fd18c67e81ed971',
                    },
                }),
            );
            // Mock `parfinApi.post` when call `KeyDictionary::addAccount`
            jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
                Promise.resolve({
                    data: {
                        id: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
                    },
                }),
            );
            const response = await controller.createClientWallet(client1)


            // Verifique se a resposta contém a mensagem 'ok'
            expect(response).toEqual({
                clientKey: "0x7ca3dc9a4a1c43a9fe8a03b17379006b526b1e0ae38dd9540c703c2ab990f385",
                wallet: "0x0000000000000000000000000000000000000001",
                parfinTxId: "497f6eca-6276-4993-bfeb-53cbbbba6f08",
                walletId: "abcdef12-1234-4321-1234abcd4321",
            });
        });
    });
});
