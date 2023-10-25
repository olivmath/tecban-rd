import { Test, TestingModule } from '@nestjs/testing';
import { ContractHelperController } from '../contract.controller';
import { ContractHelperService } from '../contract.service';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerModule } from 'src/logger/logger.module';
import { DecodeDataDTO } from '../contract.dto';
import {
    DecodedDataResponse,
    EncodedDataResponse,
} from 'src/res/app/contract.responses';

describe('ContractHelperController', () => {
    let controller: ContractHelperController;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContractHelperController],
            providers: [ContractHelperService],
            imports: [ParfinModule, LoggerModule],
        }).compile();

        controller = module.get<ContractHelperController>(
            ContractHelperController,
        );
    });

    describe('Simple decode cases', () => {
        it('should decode data for the `allowance` function of `RealDigital` contract', async () => {
            const data: DecodeDataDTO = {
                contractName: 'RealDigital',
                functionName: 'allowance',
                data: '0x0000000000000000000000000000000000000000000000000000000000000064',
            };

            const result = await controller.decodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual(['100']);
        });

        it('should decode data for the `getWallet` function of `KeyDictionary` contract', async () => {
            const data: DecodeDataDTO = {
                contractName: 'KeyDictionary',
                functionName: 'getWallet',
                data: '0x00000000000000000000000060c48562056c6cfcd2128ce60fd18c67e81ed971',
            };

            const result = await controller.decodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                '0x60C48562056C6cFCD2128CE60Fd18C67E81ed971',
            ]);
        });
    });

    describe('Complex decode cases', () => {
        it('should decode data for the `getCustomerData` function of `KeyDictionary` contract', async () => {
            const data: DecodeDataDTO = {
                contractName: 'KeyDictionary',
                functionName: 'getCustomerData',
                data:
                    '0x' +
                    '000000000000000000000000000000000000000000000000000000136fbe7b8e' +
                    '00000000000000000000000000000000000000000000000000000000000000d5' +
                    '000000000000000000000000000000000000000000000000000000003ade68b1' +
                    '000000000000000000000000000000000000000000000000000000000000162e' +
                    '000000000000000000000000f77d5d60c05238b61ed805841f5f82d7803c72f5' +
                    '0000000000000000000000000000000000000000000000000000000000000001' +
                    '00000000000000000000000060c48562056c6cfcd2128ce60fd18c67e81ed971',
            };

            const result = await controller.decodeData(data);
            const response = result as DecodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                {
                    taxId: '83479133070',
                    bankNumber: '213',
                    account: '987654321',
                    branch: '5678',
                    wallet: '0xF77d5d60C05238B61eD805841F5f82D7803c72f5',
                    registered: true,
                    owner: '0x60C48562056C6cFCD2128CE60Fd18C67E81ed971',
                },
            ]);
        });
    });
});
