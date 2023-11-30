import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RealDigitalApproveDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Endereço da carteira que está criando a transação', })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço que irá executar a operação' })
  @IsString()
  @IsNotEmpty()
  spender: string;

  @ApiProperty({ description: 'Valor a ser aprovado' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}
export class RealDigitalDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Valor da transação' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealDigitalTransferDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'CNPJ do destinatário (8 primeiros dígitos)' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealDigitalIncreaseAllowanceDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Endereço da carteira que está criando a transação', })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço que irá executar a operação' })
  @IsString()
  @IsNotEmpty()
  spender: string;

  @ApiProperty({ description: 'Valor a ser incrementado' })
  @IsString()
  @IsNotEmpty()
  addedValue: string;
}
