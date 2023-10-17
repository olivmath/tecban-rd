import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';

export class RealDigitalMintDTO extends ParfinContractInteractDTO {

  @ApiProperty({ description: 'Quantidade uint256 a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealDigitalBurnDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Quantidade uint256 a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealDigitalTransferDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'CNPJ uint256 do destinatário (8 primeiros dígitos)' })
  @IsString()
  @IsNotEmpty()
  cnpj: number;

  @ApiProperty({ description: 'Quantidade uint256 a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
