import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

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

  @ApiProperty({ description: 'Quantidade uint256 a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
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

  @ApiProperty({ description: 'CNPJ uint256 do destinatário (8 primeiros dígitos)' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
