import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';

export class RealDigitalMintDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Endereço do destinatário' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Quantidade a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealDigitalBurnDTO extends ParfinContractInteractDTO {
    @ApiProperty({ description: 'Quantidade a ser queimada' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}

export class RealDigitalTransferDTO extends ParfinContractInteractDTO {
    @ApiProperty({ description: 'CNPJ do destinatário' })
    @IsString()
    @IsNotEmpty()
    cnpj: string;

    @ApiProperty({ description: 'Quantidade a ser transferida' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
