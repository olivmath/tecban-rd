import { EncodedDataResponse } from 'src/res/app/contract-helper.responses';
import { ContractHelperController } from '../contract-helper.controller';
import { ContractHelperService } from '../contract-helper.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EncodeDataDTO } from '../../../dtos/contract-helper.dto';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerModule } from 'src/logger/logger.module';

describe('ContractHelperController', () => {
    let controller: ContractHelperController;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContractHelperController],
            providers: [ContractHelperService],
            imports: [ParfinModule, LoggerModule],
        }).compile();

        controller = module.get<ContractHelperController>(
            ContractHelperController,
        );
    });

    describe('Simple encode cases', () => {
        it('should encode data for a valid `STR` contract `requestToMint` function', async () => {
            const data: EncodeDataDTO = {
                contractName: 'STR',
                functionName: 'requestToMint(uint256)',
                args: ['100'],
            };

            const result = await controller.encodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                '0x7d637f87' +
                    '0000000000000000000000000000000000000000000000000000000000000064',
            ]);
        });

        it('should encode data for a valid `RealDigital` contract `mint` function', async () => {
            const data: EncodeDataDTO = {
                contractName: 'RealDigital',
                functionName: 'mint(address,uint256)',
                args: ['0xCBD6832Ebc203e49E2B771897067fce3c58575ac', '100'],
            };

            const result = await controller.encodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                '0x40c10f19' +
                    '000000000000000000000000cbd6832ebc203e49e2b771897067fce3c58575ac' +
                    '0000000000000000000000000000000000000000000000000000000000000064',
            ]);
        });
    });

    describe('Complex encode cases', () => {
        it('should encode data for a valid `KeyDictionary` contract `addAccount` function', async () => {
            const key =
                '0x553520fcc65e84ebd405a0a7d7eca26f8467c1e85737afd0b1267ae92f90e40c';
            const taxId = '83479133070';
            const bankNumber = '213';
            const account = '987654321';
            const branch = '5678';
            const wallet = '0xF77d5d60C05238B61eD805841F5f82D7803c72f5';

            const data: EncodeDataDTO = {
                contractName: 'KeyDictionary',
                functionName:
                    'addAccount(bytes32,uint256,uint256,uint256,uint256,address)',
                args: [key, taxId, bankNumber, account, branch, wallet],
            };

            const result = await controller.encodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                '0xc82d5d86' +
                    '553520fcc65e84ebd405a0a7d7eca26f8467c1e85737afd0b1267ae92f90e40c' +
                    '000000000000000000000000000000000000000000000000000000136fbe7b8e' +
                    '00000000000000000000000000000000000000000000000000000000000000d5' +
                    '000000000000000000000000000000000000000000000000000000003ade68b1' +
                    '000000000000000000000000000000000000000000000000000000000000162e' +
                    '000000000000000000000000f77d5d60c05238b61ed805841f5f82d7803c72f5',
            ]);
        });

        it('should encode data for a valid `ITPFtOperation1052` contract `trade` function', async () => {
            const calldata = {
                receiverToken: '0xe0959D39d357deBd6b5Cb143B30d04078C364C46',
                senderToken: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
                receiver: '0x06652404DE35F3BE183132e526d8b9be0f7db404',
                sender: '0x00A82e6cB71AF785C65Bae54925326bC85b3068d',
                operationId: '123321',
                tpftAmount: '100000',
                unitPrice: '500',
                callerPart: '0',
                tpftData: {
                    acronym: 'ABC',
                    code: 'XYZ',
                    maturityDate: '1671648000',
                },
            };

            const data: EncodeDataDTO = {
                contractName: 'ITPFtOperation1052',
                functionName:
                    'trade(uint256,address,address,address,address,uint8,tuple,uint256,uint256)',
                args: [
                    calldata.operationId,
                    calldata.sender,
                    calldata.senderToken,
                    calldata.receiver,
                    calldata.receiverToken,
                    calldata.callerPart,
                    calldata.tpftData,
                    calldata.tpftAmount,
                    calldata.unitPrice,
                ],
            };

            const result = await controller.encodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                '0x349c535f' +
                    '000000000000000000000000000000000000000000000000000000000001e1b9' +
                    '00000000000000000000000000a82e6cb71af785c65bae54925326bc85b3068d' +
                    '0000000000000000000000003fc91a3afd70395cd496c647d5a6cc9d4b2b7fad' +
                    '00000000000000000000000006652404de35f3be183132e526d8b9be0f7db404' +
                    '000000000000000000000000e0959d39d357debd6b5cb143b30d04078c364c46' +
                    '0000000000000000000000000000000000000000000000000000000000000000' +
                    '0000000000000000000000000000000000000000000000000000000000000120' +
                    '00000000000000000000000000000000000000000000000000000000000186a0' +
                    '00000000000000000000000000000000000000000000000000000000000001f4' +
                    '0000000000000000000000000000000000000000000000000000000000000060' +
                    '00000000000000000000000000000000000000000000000000000000000000a0' +
                    '0000000000000000000000000000000000000000000000000000000063a35300' +
                    '0000000000000000000000000000000000000000000000000000000000000003' +
                    '4142430000000000000000000000000000000000000000000000000000000000' +
                    '0000000000000000000000000000000000000000000000000000000000000003' +
                    '58595a0000000000000000000000000000000000000000000000000000000000',
            ]);
        });

        it('should encode data for a valid `ITPFt` contract `createTPFt` function', async () => {
            const tpftData = {
                acronym: 'ABC',
                code: 'XYZ',
                maturityDate: '1671648000',
            };

            const data: EncodeDataDTO = {
                contractName: 'ITPFt',
                functionName: 'createTPFt(tuple)',
                args: [tpftData],
            };

            const result = await controller.encodeData(data);
            const response = result as EncodedDataResponse;

            expect(response.data).toBeDefined();
            expect(response.data).toEqual([
                '0xd2bd0e12' +
                    '0000000000000000000000000000000000000000000000000000000000000020' +
                    '0000000000000000000000000000000000000000000000000000000000000060' +
                    '00000000000000000000000000000000000000000000000000000000000000a0' +
                    '0000000000000000000000000000000000000000000000000000000063a35300' +
                    '0000000000000000000000000000000000000000000000000000000000000003' +
                    '4142430000000000000000000000000000000000000000000000000000000000' +
                    '0000000000000000000000000000000000000000000000000000000000000003' +
                    '58595a0000000000000000000000000000000000000000000000000000000000',
            ]);
        });
    });
});
