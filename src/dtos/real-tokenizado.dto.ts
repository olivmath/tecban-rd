import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { ParfinContractInteractDTO } from '../dtos/parfin.dto';

export class RealTokenizadoMintDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
  })
  @IsString()
  @IsOptional()
  description?: string;

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
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoInternalTransferDTO extends ParfinContractInteractDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Hash bytes32 do CPF do destinatário' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
