import { ApiResponse } from "@nestjs/swagger";
import { ContractApproveRes } from "../app/contract.responses";

export const approve201 = ApiResponse({
  status: 400, description: 'Successful operation.', type: ContractApproveRes
});
