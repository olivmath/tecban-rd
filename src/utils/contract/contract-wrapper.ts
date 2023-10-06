import Web3 from 'web3';

type Abi = Array<any>;
type inputOutput = {
    internalType: string;
    name: string;
    type: string;
};
interface Item {
    inputs: inputOutput[];
    name: string;
    outputs: inputOutput[];
    stateMutability: string;
    type: 'function' | 'event' | 'error';
}

export default class {
    constructor(abi: Abi) {
        const web3 = new Web3();

        // create a method for each function describe in ABI
        abi.forEach((item: Item) => {
            if (item.type === 'function') {
                // create a method
                this[item.name] = (...args: any[]) => {
                    // decode function result
                    if (typeof args[0].returned !== 'undefined') {
                        const result = web3.eth.abi.decodeParameters(
                            item.outputs.map((i: inputOutput) => i.type),
                            args[0].returned,
                        );

                        return Object.values(result).slice(0, -1);
                    }
                    // encode function call
                    else {
                        const closure = (i: any) =>
                            typeof i === 'number'
                                ? web3.utils.toWei(i.toString(), 'ether')
                                : i;

                        return [
                            web3.eth.abi.encodeFunctionCall(
                                {
                                    name: item.name,
                                    type: 'function',
                                    inputs: item.inputs,
                                },
                                args.map(closure),
                            ),
                        ];
                    }
                };
            }
        });
    }

    [key: string]: (...args: any[]) => any[];
}
