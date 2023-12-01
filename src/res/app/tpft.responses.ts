import { ApiProperty } from "@nestjs/swagger";
import { EncodeDataDTO } from "src/dtos/contract-helper.dto";


export class TPFtApproveTradeRes {
  @ApiProperty({ description: 'ID da transação na Parfin de realDigital.approve(TPFtDvP)' })
  realDigitalTpftDvpApprovalTxId: string;
  @ApiProperty({ description: 'ID da transação na Parfin de realDigital.approve(SwapOneStepFrom)' })
  realDigitalSwapOneStepFromApprovalTxId: string;
  @ApiProperty({ description: 'ID da transação na Parfin de realTokenizado.approve(TPFtDvP)' })
  realTokenizadoTpftDvpApprovalTxId: string;
}
export class TPFtGetBalanceOfSuccessRes {
  @ApiProperty({ description: 'ID do TPFt (1, 2, etc.)' })
  tpftID: string;
  @ApiProperty({ description: 'Nome do TPFt (LTN, LFT, etc.)' })
  tpftAcronym: string;
  @ApiProperty({ description: 'Saldo do TPFt na carteira' })
  tpftBalanceOf: string;
  @ApiProperty({ description: 'Data de validade do TPFt' })
  expirationDate: Date;
  @ApiProperty({ description: 'Diz se o TPFt está vencido' })
  isExpired: boolean;
}

export class TPFtBuyRes {
  @ApiProperty({ description: 'ID da transação na Parfin de approve()' })
  approvalTxId: string;
  @ApiProperty({ description: 'ID da transação na Parfin de compra' })
  purchaseTxId: string;
  @ApiProperty({ description: 'Dados da compra/venda de TPFt', type: EncodeDataDTO })
  txData: EncodeDataDTO;
}

export class TPFtExternalBuyRes extends TPFtApproveTradeRes {
  @ApiProperty({ description: 'ID da transação na Parfin de compra' })
  purchaseTxId: string;
  @ApiProperty({ description: 'Dados da compra/venda de TPFt', type: EncodeDataDTO })
  txData: EncodeDataDTO;
}

export class TPFtSellRes {
  @ApiProperty({ description: 'ID da transação na Parfin' })
  parfinTxId: string;
  @ApiProperty({ description: 'Dados da compra/venda de TPFt', type: EncodeDataDTO })
  txData: EncodeDataDTO;
}
