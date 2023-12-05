import { ApiProperty } from "@nestjs/swagger";

export class ContractApproveRes {
  @ApiProperty({ description: 'ID da transação na Parfin' })
  parfinTxId: string;
}