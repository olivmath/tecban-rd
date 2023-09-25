import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class MintDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  @IsString()
  @IsNotEmpty()
  asset: string;

  @ApiProperty({ description: 'Endereço do destinatário' })
  @IsOptional()
  to?: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
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
