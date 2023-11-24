import WrapperContractABI from '../contract-helper.wrapper';
import abiLoader from '../../abi-loader';
import { AppError } from 'src/error/app.error';

describe('WrapperContractABI', () => {
    describe('Teste de encoding e decoding do Contract Wrapper', () => {
        let wrapperContractABI = new WrapperContractABI(abiLoader.REAL_DIGITAL, 'REAL_DIGITAL');

        it('deve criar uma instância de WrapperContractABI corretamente', () => {
            expect(wrapperContractABI).toBeInstanceOf(WrapperContractABI);
        });

        it('deve retornar o contrato corretamente', () => {
            expect(wrapperContractABI).toBeDefined();
        });

        it('deve retornar o todos methods do abi corretamente', () => {
            const methodNames = wrapperContractABI['functionsMap'];
            expect(methodNames.length).toEqual(72);
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
            wrapperContractABI = new WrapperContractABI(abiLoader.REAL_DIGITAL, 'REAL_DIGITAL');
        });

        it('deve retornar um erro de `Invalid ABI`', () => {
            try {
                new WrapperContractABI([], '');
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

    describe('Teste decode de eventos', () => {
        it('decodificar um evento de Transfer', () => {
            const contract = new WrapperContractABI(abiLoader.REAL_DIGITAL, 'REAL_DIGITAL');

            const event = {
                removed: false,
                logIndex: 0,
                transactionIndex: 0,
                transactionHash: '0xf123301603355effed5117cf850e54f9975e8bb2032f62f2d82fa8d2d8a63558',
                blockHash: '0x40ccd8cfffb77177fbd7dcd13348dbdd5c1c405b31ea9ea66cc8e31bbbba31fe',
                blockNumber: 1753442,
                address: '0xa3744900e39b2d7495b44715e4e720915f4a22d0',
                data: '0x00000000000000000000000000000000000000000000000000000000000003e8',
                topics: [
                    '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
                    '0x0000000000000000000000000000000000000000000000000000000000000000',
                    '0x000000000000000000000000e6443cf5f789161abf1e899d93ce2be086cef40a',
                ],
                logIndexRaw: '0x0',
                transactionIndexRaw: '0x0',
                blockNumberRaw: '0x1ac162',
            };

            const result = contract[event.topics[0]](event.topics.slice(1), event.data);
            const expected = [
                {
                    from: '0x0000000000000000000000000000000000000000',
                    to: '0xe6443CF5f789161aBF1e899D93CE2be086Cef40a',
                    value: '1000',
                    event: 'Transfer',
                },
            ];
            expect(result).toBeInstanceOf(Array);
            expect(result).toEqual(expected);
        });
    });
});
