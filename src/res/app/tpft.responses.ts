import { ApiProperty } from "@nestjs/swagger";

export class TPFtGetBalanceOfSuccessRes {
  @ApiProperty({ description: 'ID do TPFt (1, 2, etc.)' })
  tpftID: string;
  @ApiProperty({ description: 'Nome do TPFt (LTN, LFT, etc.)' })
  tpftName: string;
  @ApiProperty({ description: 'Saldo do TPFt na carteira' })
  tpftBalanceOf: string;
}