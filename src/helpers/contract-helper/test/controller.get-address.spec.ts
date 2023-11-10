import { ContractHelperController } from '../contract-helper.controller';
import { ContractHelperService } from '../contract-helper.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerModule } from 'src/logger/logger.module';

describe('ContractHelperController', () => {
    const addresses = [
        { name: 'REAL_DIGITAL_DEFAULT_ACCOUNT', address: '0x476ED2e0Faf9cfD1d0Efe3fE4C25F6ae0B2f5Ea7' },
        { name: 'REAL_DIGITAL_ENABLE_ACCOUNT', address: '0xb2cf8163dEC75C67FD7c5296fB2399872e2314fE' },
        { name: 'SWAP_TWO_STEP_RESERVE', address: '0x58D717d7F2c13D71f5946B768329b7a8A7Cf3Fc3' },
        { name: 'ARBI_REAL_TOKENIZADO', address: '0x5CDaAE24ed9dC6b2bFFDd7734216824EFF21D90a' },
        { name: 'SWAP_ONE_STEP_FROM', address: '0x46791945466f4cF29e187138Ab16d2bb55e33e53' },
        { name: 'ADDRESS_DISCOVERY', address: '0xDc2633B0cdA829bd2A54Db3Fd39b474aa0953c70' },
        { name: 'KEY_DICTIONARY', address: '0x415F23Aa2c20CF481cdECeFd2663F54cf006Bab2' },
        { name: 'SWAP_ONE_STEP', address: '0x58B3930c9c397610Df33F3E1772159258E401295' },
        { name: 'SWAP_TWO_STEP', address: '0xf78E62B6c01fa6DD0E1D08D2c6bc056aC7f56Ccd' },
        { name: 'REAL_DIGITAL', address: '0x3A34C530700E3835794eaE04d2a4F22Ce750eF7e' },
        { name: 'TPFT_1002', address: '0x451E82D9df0569B6399A281dd5cCB1d400b24767' },
        { name: 'TPFT_1052', address: '0xfe8EB9dD719B508b2d55eDC1A9928f3a57690c27' },
        { name: 'TPFT_DVP', address: '0xA20c597450bA049eDB76AD80c7edd6bf954C326f' },
        { name: 'TPFT', address: '0xc4bcAbe118Bf391cDb596b221DD0d1865a032DDB' },
        { name: 'STR', address: '0x64B5e7C7c5600ef398060fFF56b491785Bc7C528' },
    ];
    let controller: ContractHelperController;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [ContractHelperController],
            providers: [ContractHelperService],
            imports: [ParfinModule, LoggerModule],
        }).compile();

        controller = module.get<ContractHelperController>(ContractHelperController);
    });

    addresses.forEach((contract) => {
        it(`should return the correct address for ${contract.name}`, async () => {
            const result = await controller.getContractAddressByName(contract.name);
            const response = result.address;

            expect(response).toBeDefined();
            expect(response).toEqual({ address: contract.address });
        });
    });
});
