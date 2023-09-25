import {
  Priority,
} from 'src/transactions/dtos/create-transaction.dto';

export const parfinSendData = {
  customerTag: 'lorem',
  customerRefId: 'lorem',
  description: 'lorem',
  metadata: {
    data: 'lorem',
    contractAddress: 'lorem',
  },
  source: {
    assetId: 'lorem',
    walletId: 'lorem',
  },
  priority: Priority.HIGH,
};

export const parfinCallData = {
  metadata: {},
  blockchainId: 'lorem',
};
