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

  @ApiProperty({
    description: 'ID que identifica a carteira na Parfin',
    example: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
  })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({
    description: 'ID que identifica o ativo na Parfin',
    example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
  })
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

  @ApiProperty({
    description: 'ID que identifica o ativo na Parfin',
    example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
  })
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

  @ApiProperty({
    description: 'ID que identifica o ativo na Parfin',
    example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
  })
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
