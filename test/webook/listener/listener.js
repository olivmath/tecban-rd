const Web3 = require('web3');
const axios = require('axios');
const fs = require('fs');
const crypto = require('crypto');
const dotenv = require('dotenv');

dotenv.config();

const CONTRACT_ABI = JSON.parse(fs.readFileSync('../contracts/out/Token.sol/Token.json', 'utf-8')).abi;
const CONTRACT_ADDRESS = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';
const ANVIL_URL = 'ws://127.0.0.1:8546';
const TECBAN_API = 'http://127.0.0.1:3003/api/v1/webhook';

const web3 = new Web3(ANVIL_URL);
const contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);

const handleEvent = async (event) => {
    console.log('✅ Event catched');
    const payload = {
        Id: 'c447699b-0324-4204-8ab1-53b2df33e3c7',
        CustomerId: '3ee0512c-2d89-4a91-aeb6-4b54acf0addd',
        CreatedAt: '2022-07-01T14:17:22.814Z',
        Event: {
            removed: event.removed,
            logIndex: event.logIndex,
            transactionIndex: event.transactionIndex,
            transactionHash: event.transactionHash,
            blockHash: event.blockHash,
            blockNumber: event.blockNumber,
            address: event.address,
            data: event.raw.data,
            topics: event.raw.topics,
            logIndexRaw: web3.utils.toHex(event.logIndex),
            transactionIndexRaw: web3.utils.toHex(event.transactionIndex),
            blockNumberRaw: web3.utils.toHex(event.blockNumber),
        },
        BlockchainId: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
        LastTimeUpdated: '2023-06-20T20:29:57.296Z',
        LogIndex: web3.utils.toHex(event.logIndex),
        TraceKey: '78ce0610-6064-4a6d-82dc-21616f117669',
        SmartContract: '0x84326f3de67179b700c1455c5f807222c0c84ee4',
        TransactionHash: 'c447699b-0324-4204-8ab1-53b2df33e3c7',
    };
    let signature;
    try {
        signature = crypto
            .createHmac('sha256', process.env.PARFIN_PRIVATE_KEY)
            .update(JSON.stringify(payload))
            .digest('hex');
    } catch (error) {
        console.log('Erro ao assinar evento: ', error);
    }

    try {
        await axios.post(TECBAN_API, payload, {
            headers: {
                'x-webhook-signature': signature,
            },
        });
    } catch (error) {
        console.error('Erro ao chamar a API local: ', error);
    }
};

contract.events.allEvents().on('data', handleEvent).on('error', console.error);

console.log('Ouvindo eventos do contrato: ', CONTRACT_ADDRESS);
