import { ApiResponse } from '@nestjs/swagger';
import { ParfinGetWalletSuccessRes, ParfinRegisterERC20TokenSuccessRes } from '../app/parfin.responses';

// Success
export const registerERC20Token200 = ApiResponse({
  status: 201, description: 'Success', type: ParfinRegisterERC20TokenSuccessRes
});

export const getAllWallets200 = ApiResponse({
  status: 200, description: 'Successful operation.', type: [ParfinGetWalletSuccessRes]
});