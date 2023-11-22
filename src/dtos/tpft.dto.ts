import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class TPFtSetApprovalForAllDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica a carteira na Parfin', })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço do contrato que irá manipular TPFt' })
  @IsString()
  @IsNotEmpty()
  operator: string;

  @ApiProperty({ description: 'Aprovar ou não a manipulação de TPFt do operador' })
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}

export class TPFtGetBalanceOfQuery {
  @ApiProperty({ description: 'ID do TPFt (1, 2, 3, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftID: string;
}

export class TPFtGetBalanceOfDTO extends TPFtGetBalanceOfQuery {
  @ApiProperty({ description: 'Endereço da carteira' })
  @IsString()
  @IsNotEmpty()
  address: string;
}