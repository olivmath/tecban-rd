import Web3 from 'web3';

type ABI = Array<any>;
type inputOutput = {
    internalType: string;
    name: string;
    type: string;
    components?: inputOutput[];
};
interface Item {
    inputs: inputOutput[];
    name: string;
    outputs: inputOutput[];
    stateMutability: string;
    type: 'function' | 'event' | 'error';
}

export default class {
    constructor(abi: ABI) {
        const web3 = new Web3();

        // create a method for each function describe in ABI
        abi.forEach((item: Item) => {
            if (item.type === 'function') {
                // create a method
                this[item.name] = (...args: any[]) => {
                    // decode function result
                    if (typeof args[0].returned !== 'undefined') {
                        const types = item.outputs;
                        const calldata = args[0].returned;

                        const result = web3.eth.abi.decodeParameters(
                            types,
                            calldata,
                        );

                        if (
                            typeof types[0].components !== 'undefined' &&
                            types[0].type === 'tuple'
                        ) {
                            const structResult = result['0'];
                            const structObj: Record<string, string> = {};
                            types[0].components.forEach((component, index) => {
                                structObj[component.name] = structResult[index];
                            });
                            return [structObj];
                        } else {
                            return Object.values(result).slice(0, -1);
                        }
                    }
                    // encode function call
                    else {
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
                    }
                };
            }
        });
    }

    [key: string]: (...args: any[]) => any[];
}
