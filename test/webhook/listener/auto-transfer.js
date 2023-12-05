const dotenv = require('dotenv');
const Web3 = require('web3');

dotenv.config();

const CONTRACT_ABI = [
    {
        inputs: [
            {
                internalType: 'string',
                name: '_name',
                type: 'string',
            },
            {
                internalType: 'string',
                name: '_symbol',
                type: 'string',
            },
            {
                internalType: 'uint8',
                name: '_decimals',
                type: 'uint8',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: '',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];
const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const PRIVATE_KEY = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const ANVIL_URL = 'http://127.0.0.1:8545';
const BOB = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
const ALICE = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';

const web3 = new Web3(ANVIL_URL);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

async function transferTokens(fromAddress, toAddress, amount) {
    const data = contract.methods.transfer(toAddress, amount).encodeABI();

    let nonce;
    let gasPrice;
    let signedTx;
    try {
        nonce = await web3.eth.getTransactionCount(fromAddress);
        console.log('✅ Get nonce sucessful: ', nonce);
    } catch (error) {
        console.error('Erro ao pegar o nonce: ', error.message);
    }
    try {
        gasPrice = await web3.eth.getGasPrice();
        console.log('✅ Get gasPrice successful: ', gasPrice);
    } catch (error) {
        console.error('Erro ao pegar o gasPrice: ', error.message);
    }

    const tx = {
        from: fromAddress,
        to: CONTRACT_ADDRESS,
        gasPrice: gasPrice,
        data: data,
        nonce: nonce,
        chainId: 31337,
        value: web3.utils.toHex(0),
        gas: web3.utils.toHex(50000),
    };
    try {
        signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
        console.log('✅ Sign tx successful');
    } catch (error) {
        console.error('Erro ao assinar a tx: ', error.message);
    }

    try {
        const txReceipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
        console.log('✅ Transfer successful. Transaction hash: ', txReceipt.transactionHash);
    } catch (error) {
        console.error('Error enviar a tx: ', error.message);
    }
}

async function main() {
    while (true) {
        console.log('Transfer BOB to ALICE');
        try {
            await transferTokens(BOB, ALICE, web3.utils.toWei('1', 'ether'));
        } catch (error) {
            console.error(error);
        }
        await new Promise((resolve) => setTimeout(resolve, 10000));
    }
}

main();
