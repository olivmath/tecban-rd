import { BlockchainId, WalletType } from '../types/wallet.types';
import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
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
    @ApiProperty({
        description: 'Descrição da operação',
        example: 'Criando a carteira do Cliente ? Banco Arbi',
        default: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'ID do dono da carteira',
        example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
    })
    @IsString()
    @IsNotEmpty()
    ownerId: string;

    @ApiProperty({
        description: 'ID que identifica o ativo na Parfin',
        example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
    })
    @IsString()
    @IsNotEmpty()
    assetId: string;

    @ApiProperty({ description: 'CPF do cliente', example: '12345678901' })
    @IsString()
    @IsNotEmpty()
    taxId: number;

    @ApiProperty({ description: 'Código do banco do cliente', example: '123' })
    @IsString()
    @IsNotEmpty()
    bankNumber: number;

    @ApiProperty({ description: 'Conta do banco do cliente', example: '987654' })
    @IsString()
    @IsNotEmpty()
    account: number;

    @ApiProperty({ description: 'Agência do banco do cliente', example: '4567' })
    @IsString()
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

    @ApiProperty({
        description: 'Ativo da operação',
        example: 'RD'
    })
    @IsString()
    @IsNotEmpty()
    asset: string;

    @ApiProperty({
        description: 'ID que identifica o ativo na Parfin',
        example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
    })
    @IsString()
    @IsNotEmpty()
    assetId: string;

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
