import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';

export class RealTokenizadoMintDTO {
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

  @ApiProperty({ description: 'Endereço da carteira do destinatário' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
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

export class RealTokenizadoBurnFromDTO {
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

  @ApiProperty({
    description: 'Endereço da conta onde será feito o resgate',
    example: '0xc0ffee254729296a45a3885639AC7E10F9d54979',
  })
  @IsString()
  @IsNotEmpty()
  account: string;

  @ApiProperty({
    description: 'Quantidade uint256 a ser queimada',
    example: 1000
  })
  @IsString()
  @IsNotEmpty()
  amount: string;
}

export class RealTokenizadoApproveBurnDTO {
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

  @ApiProperty({
    description: 'ID que identifica o ativo na Parfin',
    example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
  })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Hash bytes32 do CPF do destinatário' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
