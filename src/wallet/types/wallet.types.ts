import {
    IsString,
    IsArray,
    IsBoolean,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export enum WalletType {
    CUSTODY = 'CUSTODY',
    HOTWALLET = 'HOTWALLET',
}

export enum OwnerType {
    INSTITUTION = 'INSTITUTION',
    CLIENT = 'CLIENT',
}

export enum BlockchainId {
    BLOCKCHAIN_ID = 'ba727c86-3d6d-44dd-af4c-1b34f1c3b00d',
}

export enum AssetID {
    realDigital = '0430a64a-088a-4346-895e-e78c02a14345',
    realTokenizado = '',
    tpft = '',
}

export class WalletAsset {
    @ApiProperty({ description: 'ID do ativo da carteira' })
    @IsString()
    assetId: string;

    @ApiProperty({ description: 'Saldo disponível do ativo' })
    @IsString()
    availableBalance: string;

    @ApiProperty({ description: 'Saldo total do ativo' })
    @IsString()
    balance: string;

    @ApiProperty({ description: 'Data de criação do ativo' })
    @IsString()
    createdTime: string;

    @ApiProperty({ description: 'Código do ativo' })
    @IsString()
    blockchainTokenCode: string;

    @ApiProperty({ description: 'Nome do ativo' })
    @IsString()
    blockchainTokenName: string;

    @ApiProperty({ description: 'ID da blockchain que o ativo pertence' })
    @IsString()
    blockchainTokenId: string;
}

export class Wallet {
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
    @Type(() => WalletAsset)
    assets: WalletAsset[];

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
