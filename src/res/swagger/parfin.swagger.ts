import { ApiResponse } from '@nestjs/swagger';
import { ParfinRegisterContractSuccessRes } from '../app/parfin.responses';

// Success
export const registerERC20Token200 = ApiResponse({
  status: 201, description: 'Success', type: ParfinRegisterContractSuccessRes
});