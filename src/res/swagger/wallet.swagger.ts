import { ApiResponse } from '@nestjs/swagger';
import { WalletSuccessRes } from '../app/wallet.responses';

// Success
export const getAllWallets200 = ApiResponse({
  status: 200, description: 'Successful operation.', type: [WalletSuccessRes]
});
export const getWalletById200 = ApiResponse({
  status: 200, description: 'Successful operation.', type: WalletSuccessRes
});
export const createWallet201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: WalletSuccessRes
});
export const enableWallet200 = ApiResponse({ status: 200, description: 'Success' });