import { Test, TestingModule } from '@nestjs/testing';
import { RealDigitalController } from '../real-digital.controller';
import { RealDigitalService } from '../real-digital.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { LoggerService } from 'src/logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinAuth } from 'src/auth/parfin.auth';
import { parfinApi } from 'src/config/parfin-api-client';

describe('RealDigitalController', () => {
    let controller: RealDigitalController;
    let service: RealDigitalService;
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [MongooseModule.forRoot(uri), TransactionsModule],
            controllers: [RealDigitalController],
            providers: [RealDigitalService, ParfinService, ContractHelperService, LoggerService, ParfinAuth],
        }).compile();

        controller = module.get<RealDigitalController>(RealDigitalController);
        service = module.get<RealDigitalService>(RealDigitalService);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    it('should call balanceOf method and return a response', async () => {
        const mockResponse = {
            realDigitalBalanceOf: 1,
            realDigitalFrozenBalanceOf: 0,
        };
        // Mock `parfinApi.post` when address discovery call
        jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x00000000000000000000000060c48562056c6cfcd2128ce60fd18c67e81ed971',
                },
            }),
        );
        // Mock `parfinApi.post` when real digital balance of call
        jest.spyOn(parfinApi, 'post').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
                },
            }),
        );

        // Mock `parfinApi.post` when real digital frozen balance of call
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
            realDigitalBalanceOf: '100',
            realDigitalFrozenBalanceOf: '256',
        });
        jest.restoreAllMocks();
    });
});
