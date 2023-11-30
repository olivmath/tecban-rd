import { AppError } from 'src/error/app.error';
import Web3 from 'web3';

type inputOutput = {
    internalType: string;
    name: string;
    type: string;
    indexed: boolean;
    components?: inputOutput[];
};

type Item = {
    inputs: inputOutput[];
    name: string;
    outputs: inputOutput[];
    stateMutability: string;
    type: 'function' | 'event' | 'error';
};
type ABI = Array<any>;

/**
 * # Abstração para um smartcontract baseado na sua ABI
 *
 * Esta classe fornece uma maneira conveniente de trabalhar com ABIs de contrato Ethereum,
 * incluindo codificação e decodificação de chamadas de função e manipulação de diferentes tipos de dados.
 *
 * @param abi - O ABI (Application Binary Interface) do contrato Ethereum.
 *
 * @example
 * ## Codificação de chamadas de função para contratos
 *
 * - **Para fazer uma chamada é preciso passar os tipos dos parametros**
 * - Isso é necessário pois solidity suporta [function overloading](https://docs.soliditylang.org/en/v0.8.22/contracts.html#function-overloading)
 *
 * ```javascript
 * const contract = new WrapperContractABI(abi);
 * const encodedCall = contract['approve(address,uint256)'](
 *   '0xf2e05Efe980110EBA4a5521C4D9FCEA3eeCE33F4',
 *   1000,
 * );
 * expect(encodedCall).toEqual([
 *     '0x095ea7b3' +
 *     '000000000000000000000000f2e05efe980110eba4a5521c4d9fcea3eece33f4' +
 *     '00000000000000000000000000000000000000000000000000000000000003e8',
 * ]);
 * ```
 *
 * @example
 * ## Decoding Function Call Results for Contracts
 *
 * - **Para decodificar um retorno, apenas passe o `calldata`**
 *
 * ```javascript
 * const decodedReturn = contract['approve'](
 *     '0x0000000000000000000000000000000000000000000000000000000000000001',
 * );
 * expect(decodedReturn).toEqual([true]);
 * ```
 */
export default class WrapperContractABI {
    private functionsMap: { [signature: string]: (...args: any[]) => any[] };

    constructor(abi: ABI, name: string) {
        const web3 = new Web3();

        // Validation
        if (typeof abi === 'undefined') {
            throw new AppError(500, `ABI not found, contractName: ${name}`);
        }

        if (!Array.isArray(abi)) {
            throw new AppError(500, `InvalidABIType: must be an array.`);
        }
        if (abi.length === 0) {
            throw new AppError(500, `InvalidABILenght: must not be empty array.`);
        }
        const invalidItem = abi.find((item) => {
            const isValid =
                typeof item === 'object' &&
                item !== null &&
                'inputs' in item &&
                'type' in item &&
                ['error', 'function', 'constructor', 'event', 'fallback', 'receive'].includes(item.type);

            return !isValid;
        });

        if (invalidItem) {
            throw new AppError(
                500,
                `InvalidABIItemType: Item ${JSON.stringify(invalidItem)} does not match the Item structure.`,
            );
        }

        // Map para armazenar funções com base na assinatura
        // const functionMap: { [signature: string]: (...args: any[]) => any[] } = {};
        this.functionsMap = {};

        abi.forEach((item: Item) => {
            if (item.type === 'event') {
                const eventSign = `${item.name}(${item.inputs.map((input) => input.type).join(',')})`;
                const eventSignHash = web3.utils.keccak256(eventSign);

                this.functionsMap[eventSignHash] = (...args: any[]) => {
                    const eventData = args[0];
                    const data = args[1];
                    const decodedParams = web3.eth.abi.decodeLog(item.inputs, data, eventData);

                    const decodedData: Record<string, any> = {};
                    decodedData["event"] = item.name
                    item.inputs.forEach((input, index) => {
                        decodedData[input.name] = decodedParams[index];
                    });

                    return [decodedData];
                };
            }

            if (item.type === 'function') {
                const callFunctionSignature = `${item.name}(${item.inputs.map((input) => input.type).join(',')})`;

                this.functionsMap[callFunctionSignature] = (...args: any[]) => {
                    try {
                        return [
                            web3.eth.abi.encodeFunctionCall(
                                {
                                    name: item.name,
                                    type: 'function',
                                    inputs: item.inputs,
                                },
                                args,
                            ),
                        ];
                    } catch (erro) {
                        throw new AppError(
                            500,
                            `InvalidEncoding: \`${callFunctionSignature}\`, Args: ${JSON.stringify(args)}`,
                        );
                    }
                };

                if (item.outputs.length > 0) {
                    this.functionsMap[item.name] = (...args: any[]) => {
                        const types = item.outputs;
                        const calldata = args[0];

                        let result;
                        try {
                            result = web3.eth.abi.decodeParameters(types, calldata);
                        } catch (error) {
                            throw new AppError(500, `InvalidDecoding: \`${item.name}\`, Args: ${JSON.stringify(args)}`);
                        }
                        if (typeof types[0].components !== 'undefined' && types[0].type === 'tuple') {
                            const structResult = result['0'];
                            const structObj: Record<string, string> = {};
                            types[0].components.forEach((component, index) => {
                                structObj[component.name] = structResult[index];
                            });
                            return [structObj];
                        } else {
                            return Object.values(result).slice(0, -1);
                        }
                    };
                }
            }
        });

        return new Proxy(this, {
            get(target, propKey) {
                if (propKey === 'functionsMap') {
                    return Object.getOwnPropertyNames(target.functionsMap);
                } else if (propKey in target.functionsMap) {
                    return (...args: any[]) => {
                        return target.functionsMap[propKey.toString()](...args);
                    };
                } else {
                    throw new AppError(500, `InvalidFunction: \`${propKey.toString()}\``);
                }
            },
        });
    }
}
