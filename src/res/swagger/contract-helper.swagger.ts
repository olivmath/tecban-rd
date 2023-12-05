import { ApiResponse } from "@nestjs/swagger";
import { ContractHelperGetContractSuccessRes, DecodedDataResponse, EncodedDataResponse } from "../app/contract-helper.responses";

export const getContractAddress200 = ApiResponse({
  status: 200, description: 'Success', type: ContractHelperGetContractSuccessRes
});

export const encodeData200 = ApiResponse({
  status: 200, description: 'Success', type: EncodedDataResponse
});

export const decodeData200 = ApiResponse({
  status: 200, description: 'Success', type: DecodedDataResponse
});