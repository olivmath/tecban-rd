import { ApiProperty } from '@nestjs/swagger';

export class MintDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  asset: string;

  @ApiProperty({ description: 'Endereço do destinatário' })
  to?: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  amount: number;
}

export class BurnDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  asset: string;

  @ApiProperty({ description: 'Quantidade a ser queimada' })
  amount: number;

  @ApiProperty({ description: 'Endereço da carteira' })
  from: string;
}

export class TransferDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  asset: string;

  @ApiProperty({ description: 'CNPJ do destinatário' })
  cnpj: string;

  @ApiProperty({ description: 'Endereço do destinatário' })
  to: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  amount: number;
}
