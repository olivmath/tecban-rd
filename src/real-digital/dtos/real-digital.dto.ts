import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RealDigitalMintDTO {
  @ApiProperty({ description: 'Quantidade a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealDigitalBurnDTO {
  @ApiProperty({ description: 'Quantidade a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealDigitalTransferDTO {
  @ApiProperty({ description: 'CNPJ do destinatário' })
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
