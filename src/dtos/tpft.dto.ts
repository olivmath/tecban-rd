import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class TPFtGetBalanceOfBody {
  @ApiProperty({ description: 'ID do TPFt (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftID: string;
}

export class TPFtGetBalanceOfDTO extends TPFtGetBalanceOfBody {
  @ApiProperty({ description: 'Endereço da carteira' })
  @IsString()
  @IsNotEmpty()
  address: string;
}