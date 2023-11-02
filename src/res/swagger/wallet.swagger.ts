import { ApiResponse } from '@nestjs/swagger';
import {
  WalletCreateSuccessRes,
  WalletCreateClientSuccessRes,
  WalletAddNewAssetSuccessRes
} from '../app/wallet.responses';
// Success
export const getAllWallets200 = ApiResponse({
  status: 200, description: 'Successful operation.', type: [WalletCreateSuccessRes]
});
export const getWalletById200 = ApiResponse({
  status: 200, description: 'Successful operation.', type: WalletCreateSuccessRes
});
export const createWallet201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: WalletCreateSuccessRes
});
export const createClientWallet201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: WalletCreateClientSuccessRes
});
export const enableWallet200 = ApiResponse({ status: 200, description: 'Success' });

export const newAssetAdded201 = ApiResponse({
  status: 201,
  description: 'Successful operation.',
  type: WalletAddNewAssetSuccessRes,
});