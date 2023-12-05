import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RealTokenizadoMintDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Endereço da carteira do destinatário' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Quantidade a ser emitida' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealTokenizadoBurnDTO {
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

  @ApiProperty({ description: 'Quantidade a ser queimada' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealTokenizadoBurnFromDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Endereço da conta onde será feito o resgate' })
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty({
    description: 'Quantidade a ser queimada',
    example: 1000
  })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealTokenizadoApproveDTO {
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

export class RealTokenizadoInternalTransferDTO {
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

  @ApiProperty({ description: 'CPF do destinatário' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealTokenizadoExternalTransferDTO {
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

  @ApiProperty({ description: 'Endereço do contrato Real Tokenizado do banco do cliente recebedor' })
  @IsString()
  @IsNotEmpty()
  tokenReceiver: string;

  @ApiProperty({ description: 'Endereço da carteira do recebedor' })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealTokenizadoIncreaseAllowanceDTO {
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
