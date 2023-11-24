import { ApiResponse } from "@nestjs/swagger";
import { TPFtGetBalanceOfSuccessRes, TPFtBuyRes, TPFtSellRes } from "../app/tpft.responses";

// Success
export const getTpftBalance201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: TPFtGetBalanceOfSuccessRes
});

export const buyTpft201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: TPFtBuyRes
});

export const sellTpft201 = ApiResponse({
  status: 201, description: 'Successful operation.', type: TPFtSellRes
});