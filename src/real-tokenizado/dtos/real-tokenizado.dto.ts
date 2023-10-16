import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';

export class RealTokenizadoMintDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Endereço da carteira do destinatário' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoBurnDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Quantidade uint256 a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoInternalTransferDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Hash bytes32 do CPF do destinatário' })
  @IsString()
  @IsNotEmpty()
  key: string;

  @ApiProperty({ description: 'Quantidade uint256 a ser transferida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}
