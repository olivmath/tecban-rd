import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { AssetID } from 'src/wallet/types/wallet.types';

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export class Source {
    @ApiProperty({
        description: 'ID que representa o ativo do contrato',
        enum: ['0430a64a-088a-4346-895e-e78c02a14345', '', ''],
    })
    @IsNotEmpty()
    assetId: AssetID;
}

export class DeployMetadata {
    @ApiProperty({ description: 'Metadata para a interação com o contrato' })
    @IsString()
    @IsNotEmpty()
    data: string;
}

export class InteractMetadata extends DeployMetadata {
    @ApiProperty({ description: 'Endereço do contrato para interação' })
    @IsString()
    @IsNotEmpty()
    contractAddress: string;
}