import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class RealTokenizadoMintDTO {
  @ApiProperty({ description: 'Endereço do destinatário' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Quantidade a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoBurnDTO {
  @ApiProperty({ description: 'Quantidade a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoTransferDTO {
  @ApiProperty({ description: 'CPF do destinatário' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
