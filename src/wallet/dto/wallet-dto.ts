import {
  IsString,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class AssetDTO {
  @IsString()
  assetId: string;

  @IsString()
  blockchainTokenId: string;

  @IsString()
  availableBalance: string;

  @IsString()
  balance: string;

  @IsString()
  createdTime: Date;

  @IsString()
  blockchainTokenCode: string;

  @IsString()
  blockchainTokenName: string;
}

export class CreateWalletDTO {
  @ApiProperty({ description: 'Nome da carteira' })
  @IsString()
  @IsNotEmpty()
  walletName: string;

  @ApiProperty({ description: 'ID da blockchain' })
  @IsString()
  @IsNotEmpty()
  blockchainId: string;

  @ApiProperty({ description: 'Tipo de carteira' })
  @IsString()
  @IsNotEmpty()
  walletType: string;
}

export class CreateClientWalletDTO {
  @ApiProperty({ description: 'ID do contrato' })
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({ description: 'Nome da carteira' })
  @IsString()
  @IsNotEmpty()
  walletName: string;

  @ApiProperty({ description: 'ID da blockchain' })
  @IsString()
  @IsNotEmpty()
  blockchainId: string;

  @ApiProperty({ description: 'Tipo de carteira' })
  @IsString()
  @IsNotEmpty()
  walletType: string;
}

export class WalletDTO {
  @IsString()
  id: string;

  @IsString()
  blockchainNetwork: string;

  @IsString()
  blockchainName: string;

  @IsString()
  blockchainId: string;

  @IsString()
  walletId: string;

  @IsString()
  address: string;

  @IsString()
  name: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AssetDTO)
  assets: AssetDTO[];

  @IsBoolean()
  enabled: boolean;

  @IsBoolean()
  isBlocked: boolean;

  @IsArray()
  @IsString({ each: true })
  blockedMetadataHistory: string[];

  @IsString()
  walletType: string;

  @IsOptional()
  @IsString()
  companyId?: string;

  @IsOptional()
  @IsString()
  userId?: string;
}

export class ResponseWalletDTO {
  @ApiProperty({ description: 'Nome da carteira' })
  walletName: string;

  @ApiProperty({ description: 'ID da blockchain' })
  blockchainId: string;

  @ApiProperty({ description: 'Tipo de carteira' })
  walletType: string;
}

export class EnableWalletDTO {
  @ApiProperty({ description: 'Ativo da carteira' })
  asset: string;

  @ApiProperty({ description: 'Endereço da carteira' })
  address: string;
}
