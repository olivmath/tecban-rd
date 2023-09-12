
import { IsString, IsArray, IsBoolean, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

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
