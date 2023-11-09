import WrapperContractABI from '../contract-helper.wrapper';
import abiLoader from '../../abi-loader';
import { AppError } from 'src/error/app.error';

describe('WrapperContractABI', () => {
    describe('Teste de encoding e decoding do Contract Wrapper', () => {
        let wrapperContractABI = new WrapperContractABI(abiLoader.RealDigital);

        it('deve criar uma instância de WrapperContractABI corretamente', () => {
            expect(wrapperContractABI).toBeInstanceOf(WrapperContractABI);
        });

        it('deve retornar o contrato corretamente', () => {
            expect(wrapperContractABI).toBeDefined();
        });

        it('deve retornar o todos methods do abi corretamente', () => {
            const methodNames = wrapperContractABI['functionsMap'];
            expect(methodNames.length).toEqual(62);
        });

        it('deve retornar o hex para uma chamada de uma funcao qualquer do abi', () => {
            const encodedCall = wrapperContractABI['approve(address,uint256)'](
                '0xf2e05Efe980110EBA4a5521C4D9FCEA3eeCE33F4',

                1000,
            );
            expect(encodedCall).toEqual([
                '0x095ea7b3' +
                    '000000000000000000000000f2e05efe980110eba4a5521c4d9fcea3eece33f4' +
                    '00000000000000000000000000000000000000000000000000000000000003e8',
            ]);
        });

        it('deve retornar o valor decodificado para o retorno de uma chamada de funcao qualquer do abi', () => {
            const decodedReturn = wrapperContractABI['approve'](
                '0x0000000000000000000000000000000000000000000000000000000000000001',
            );
            expect(decodedReturn).toEqual([true]);
        });
    });

    describe('Teste de trycatch', () => {
        let wrapperContractABI: WrapperContractABI;
        beforeAll(() => {
            wrapperContractABI = new WrapperContractABI(abiLoader.RealDigital);
        });

        it('deve retornar um erro de `Invalid ABI`', () => {
            try {
                new WrapperContractABI([]);
                fail('Deveria ter lançado um AppError');
            } catch (e) {
                expect(e).toBeInstanceOf(AppError);
                expect(e.statusCode).toBe(500);
                expect(e.message).toMatch('InvalidABILenght: must not be empty array');
            }
        });

        it('deve retornar um erro de `InvalidFunction`', () => {
            try {
                wrapperContractABI['approve(address,nt256)']('0xf2e05Efe980110EBA4a5521C4D9FCEA3eeCE33F4', 1000);
            } catch (e) {
                expect(e).toBeInstanceOf(AppError);
                expect(e.statusCode).toBe(500);
                expect(e.message).toEqual('InvalidFunction: `approve(address,nt256)`');
            }
        });

        it('deve retornar um erro de `InvalidEncoding`', () => {
            try {
                wrapperContractABI['approve(address,uint256)']('0xf2e053', 1000);
            } catch (e) {
                expect(e).toBeInstanceOf(AppError);
                expect(e.statusCode).toBe(500);
                expect(e.message).toEqual('InvalidEncoding: `approve(address,uint256)`, Args: ["0xf2e053",1000]');
            }
        });

        it('deve retornar um erro de `InvalidDecoding`', () => {
            try {
                wrapperContractABI['approve']('0x5454');
            } catch (e) {
                expect(e).toBeInstanceOf(AppError);
                expect(e.statusCode).toBe(500);
                expect(e.message).toEqual('InvalidDecoding: `approve`, Args: ["0x5454"]');
            }
        });
    });
});
