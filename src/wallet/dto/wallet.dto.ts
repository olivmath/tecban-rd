import { ParfinContractInteractDTO } from 'src/parfin/dtos/parfin.dto';
import { BlockchainId, WalletType } from '../types/wallet.types';
import { IsString, IsNotEmpty } from 'class-validator';
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

export class WalletClientCreateDTO extends ParfinContractInteractDTO {
    // TODO: entender melhor esse dado
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
    @ApiProperty({ description: 'Chave da carteira' })
    key: string;

    @ApiProperty({ description: 'CPF da wallet' })
    taxId: number;

    @ApiProperty({ description: 'Código do banco da carteira' })
    bankNumber: number;

    @ApiProperty({ description: 'Conta do banco da carteira' })
    account: number;

    @ApiProperty({ description: 'Agência do banco da carteira' })
    branch: number;

    @ApiProperty({ description: 'Endereço da carteira' })
    wallet: string;
}

export class WalletEnableDTO extends ParfinContractInteractDTO {
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
