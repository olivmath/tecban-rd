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

  @ApiProperty({ description: 'CNPJ uint256 do destinatário (8 primeiros dígitos)' })
  @IsNumber()
  @IsNotEmpty()
  cnpj: number;

  @ApiProperty({ description: 'Quantidade uint256 a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
