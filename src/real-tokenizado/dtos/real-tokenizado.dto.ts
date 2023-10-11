import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';

export class RealTokenizadoMintDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Endereço do destinatário' })
  @IsString()
  @IsNotEmpty()
  to: string;

  @ApiProperty({ description: 'Quantidade a ser emitida' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoBurnDTO extends ParfinContractInteractDTO {
  @ApiProperty({ description: 'Quantidade a ser queimada' })
  @IsNumber()
  @IsNotEmpty()
  amount: number;
}

export class RealTokenizadoInternalTransferDTO extends ParfinContractInteractDTO {
    @ApiProperty({ description: 'Key do destinatário' })
    @IsString()
    @IsNotEmpty()
    key: string;

    @ApiProperty({ description: 'Quantidade a ser transferida' })
    @IsNumber()
    @IsNotEmpty()
    amount: number;
}
