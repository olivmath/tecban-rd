import { Test, TestingModule } from '@nestjs/testing';
import { ParfinService } from 'src/parfin/parfin.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { LoggerService } from 'src/logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinAuth } from 'src/auth/parfin.auth';
import { parfinApi } from 'src/config/parfin-api-client';
import { RealTokenizadoController } from '../real-tokenizado.controller';
import { RealTokenizadoService } from '../real-tokenizado.service';

describe('RealTokenizadoController', () => {
    let controller: RealTokenizadoController;
    let service: RealTokenizadoService;
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [MongooseModule.forRoot(uri), TransactionsModule],
            controllers: [RealTokenizadoController],
            providers: [RealTokenizadoService, ParfinService, ContractHelperService, LoggerService, ParfinAuth],
        }).compile();

        controller = module.get<RealTokenizadoController>(RealTokenizadoController);
        service = module.get<RealTokenizadoService>(RealTokenizadoService);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    it('should call balanceOf method and return a response', async () => {
        // Mock `parfinApi.post` when address discovery call
        jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x00000000000000000000000060c48562056c6cfcd2128ce60fd18c67e81ed971',
                },
            }),
        );
        // Mock `parfinApi.post` when real tokenizado balance of call
        jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
                },
            }),
        );

        // Mock `parfinApi.post` when real tokenizado frozen balance of call
        jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x0000000000000000000000000000000000000000000000000000000000000100',
                },
            }),
        );

        const address = '0x5be4C55e1977E555DB9a815a2CDed576A71Ca3c2';
        const result = await controller.balanceOf(address);

        expect(result).toEqual({
            realTokenizadoBalanceOf: '100',
            realTokenizadoFrozenBalanceOf: '256',
        });
        jest.restoreAllMocks();
    });
});
