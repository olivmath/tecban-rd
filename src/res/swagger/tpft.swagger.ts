import { ApiResponse } from "@nestjs/swagger";
import { TPFtGetBalanceOfSuccessRes, TPFtTradeRes } from "../app/tpft.responses";

// Success
export const getTpftBalance201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: TPFtGetBalanceOfSuccessRes
});

export const tradeTpft201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: TPFtTradeRes
});