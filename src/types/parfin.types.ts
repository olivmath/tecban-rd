import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export class Source {
    @ApiProperty({
        description: 'ID que identifica o ativo na Parfin',
        example: '01574a14-25bc-45f6-aaf6-cd71a60b1d35',
    })
    @IsString()
    @IsNotEmpty()
    assetId: string;
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

    @ApiProperty({
        description: 'Endereço da carteira que está chamando o contrato',
        default: process.env.ARBI_DEFAULT_WALLET_ADDRESS,
        required: false,
    })
    @IsString()
    @IsOptional()
    from?: string;
}