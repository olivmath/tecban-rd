import { BlockchainId, WalletType } from '../types/wallet.types';
import { IsString, IsNumber, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletCreateDTO {
    @ApiProperty({ description: 'Nome da carteira' })
    @IsString()
    @IsNotEmpty()
    walletName: string;

    @ApiProperty({
        description: 'ID da blocklchain onde será utilizada a carteira',
        enum: Object.values(BlockchainId),
        default: BlockchainId.BLOCKCHAIN_ID,
    })
    @IsEnum(BlockchainId)
    @IsOptional()
    blockchainId?: BlockchainId;

    @ApiProperty({
        description: 'Tipo de custódia da carteira',
        enum: Object.values(WalletType),
        default: WalletType.CUSTODY,
    })
    @IsEnum(WalletType)
    @IsOptional()
    walletType?: WalletType;
}

export class WalletClientCreateDTO extends WalletCreateDTO {
    @ApiProperty({ description: 'CPF do cliente', example: 12345678901 })
    @IsNumber()
    @IsNotEmpty()
    taxId: number;

    @ApiProperty({ description: 'Código do banco do cliente', example: 123 })
    @IsNumber()
    @IsNotEmpty()
    bankNumber: number;

    @ApiProperty({ description: 'Conta do banco do cliente', example: 987654 })
    @IsNumber()
    @IsNotEmpty()
    account: number;

    @ApiProperty({ description: 'Agência do banco do cliente', example: 4567 })
    @IsNumber()
    @IsNotEmpty()
    branch: number;
}

export class WalletEnableDTO {
    @ApiProperty({
        description: 'Descrição da interação com o contrato',
        default: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Ativo da carteira' })
    @IsString()
    @IsNotEmpty()
    asset: string;

    @ApiProperty({ description: 'Endereço da carteira' })
    @IsString()
    @IsNotEmpty()
    walletAddress: string;
}

export class WalletNewAssetDTO {
    @ApiProperty({ description: 'ID do token ERC20' })
    @IsString()
    @IsNotEmpty()
    blockchainTokenId: string;

    @ApiProperty({ description: 'ID da carteira' })
    @IsString()
    @IsNotEmpty()
    walletId: string;
}
