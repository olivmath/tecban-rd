import { ParfinContractInteractDTO } from '../dtos/parfin.dto';
import { BlockchainId, WalletType } from '../types/wallet.types';
import { IsString, IsNotEmpty, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WalletInstitutionCreateDTO {
    @ApiProperty({ description: 'Nome da carteira' })
    @IsString()
    @IsNotEmpty()
    walletName: string;

    @ApiProperty({
        description: 'ID da blocklchain onde será utilizada a carteira',
        enum: BlockchainId,
        enumName: 'BlockchainId',
        default: BlockchainId.BLOCKCHAIN_ID,
    })
    @IsString()
    @IsNotEmpty()
    blockchainId: BlockchainId = BlockchainId.BLOCKCHAIN_ID;

    @ApiProperty({
        description: 'Tipo de custódia da carteira',
        enum: WalletType,
        enumName: 'WalletType',
        default: WalletType.CUSTODY,
    })
    @IsString()
    @IsNotEmpty()
    walletType: WalletType = WalletType.CUSTODY;
}

export class WalletClientCreateDTO {
    @ApiProperty({ description: 'Nome do Cliente', example: "Lucas Oliveira" })
    @IsString()
    @IsNotEmpty()
    walletName: string;

    @ApiProperty({
        description: 'ID da blocklchain onde será utilizada a carteira',
        enum: BlockchainId,
        enumName: 'BlockchainId',
        default: BlockchainId.BLOCKCHAIN_ID,
    })
    @IsString()
    @IsNotEmpty()
    blockchainId?: BlockchainId = BlockchainId.BLOCKCHAIN_ID;

    @ApiProperty({
        description: 'Tipo de custódia da carteira',
        enum: WalletType,
        enumName: 'WalletType',
        default: WalletType.CUSTODY,
    })
    @IsString()
    @IsNotEmpty()
    walletType?: WalletType = WalletType.CUSTODY;

    @ApiProperty({ description: 'Chave da carteira, hashs keccak256 do CPF', example: "0x99f90daae883d399edb194ba4b903d39979fec8eca0240465e3bb8115a5ef71b" })
    key?: string;

    @ApiProperty({ description: 'CPF da wallet', example: 12345678901 })
    taxId: number;

    @ApiProperty({ description: 'Código do banco da carteira', example: 123 })
    bankNumber: number;

    @ApiProperty({ description: 'Conta do banco da carteira', example: 987654 })
    account: number;

    @ApiProperty({ description: 'Agência do banco da carteira', example: 4567 })
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
    @ApiProperty({ description: 'ID do Token ERC20' })
    @IsString()
    @IsNotEmpty()
    blockchainTokenId: string;

    @ApiProperty({ description: 'ID da carteira' })
    @IsString()
    @IsNotEmpty()
    walletId: string;
}
