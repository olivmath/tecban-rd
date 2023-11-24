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

export class TPFtAuctionPlacementDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID único da operação 1002 na data que a operação será executada' })
  @IsString()
  @IsNotEmpty()
  operationId: string;

  @ApiProperty({ description: 'ID do TPFt (1, 2, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftID: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (o exemplo são 1.000 unidades com 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;
}