import { Test, TestingModule } from '@nestjs/testing';
import { RealDigitalController } from '../real-digital.controller';
import { RealDigitalService } from '../real-digital.service';
import { ParfinService } from 'src/parfin/parfin.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { LoggerService } from 'src/logger/logger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { TransactionsModule } from 'src/transactions/transactions.module';
import { ParfinHttpService } from 'src/parfin/parfin.api.service';
import { AxiosResponse } from 'axios';

describe('RealDigitalController', () => {
    let controller: RealDigitalController;
    let service: ParfinHttpService;
    let mongod: MongoMemoryServer;

    beforeAll(async () => {
        // This will create an new instance of "MongoMemoryServer" and automatically start it
        mongod = await MongoMemoryServer.create();
        const uri = mongod.getUri();

        const module: TestingModule = await Test.createTestingModule({
            imports: [MongooseModule.forRoot(uri), TransactionsModule],
            controllers: [RealDigitalController],
            providers: [RealDigitalService, ParfinService, ContractHelperService, LoggerService, ParfinHttpService],
        }).compile();

        controller = module.get<RealDigitalController>(RealDigitalController);
        service = module.get<ParfinHttpService>(ParfinHttpService);
    });

    afterAll(async () => {
        await mongod.stop();
    });

    it('should call balanceOf method and return a response', async () => {
        const mockResponse = {
            realDigitalBalanceOf: 1,
            realDigitalFrozenBalanceOf: 0,
        };
        // Mock `ParfinHttpService.makeRequest` when address discovery call
        jest.spyOn(service, 'makeRequest').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x00000000000000000000000060c48562056c6cfcd2128ce60fd18c67e81ed971',
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse),
        );
        // Mock `ParfinHttpService.makeRequest` when real digital balance of call
        jest.spyOn(service, 'makeRequest').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x0000000000000000000000000000000000000000000000000000000000000064',
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse),
        );

        // Mock `ParfinHttpService.makeRequest` when real digital frozen balance of call
        jest.spyOn(service, 'makeRequest').mockResolvedValueOnce(
            Promise.resolve({
                data: {
                    data: '0x0000000000000000000000000000000000000000000000000000000000000100',
                },
                status: 200,
                statusText: 'OK',
                headers: {},
                config: {},
            } as AxiosResponse),
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
