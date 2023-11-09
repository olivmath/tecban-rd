import { Test, TestingModule } from '@nestjs/testing';
import { ParfinController } from 'src/parfin/parfin.controller';
import { ParfinService } from 'src/parfin/parfin.service';

describe('ParfinController', () => {
    let controller: ParfinController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ParfinController],
            providers: [ParfinService],
        }).compile();

        controller = module.get<ParfinController>(ParfinController);
    });

    describe('Gets Parfin', () => {
        it('[getAllContracts] should get `all contracts` and return `a list of contracts`', async () => {
            expect(1).toEqual(2)
        });
        it('[getAllWallets] should get `all wallets` and return `a list of wallets`', async () => {
            expect(1).toEqual(2)
        });
        it('[getWalletById] should get `a wallet by id` and return `the wallet`', async () => {
            expect(1).toEqual(2)
        });
        it('[getAllTransactions] should get `all transactions` and return `a list of transactions`', async () => {
            expect(1).toEqual(2)
        });
        it('[getTransactionById] should get `a transaction by id` and return `the transaction`', async () => {
            expect(1).toEqual(2)
        });
    });
});
