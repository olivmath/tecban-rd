import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export enum Priority {
    LOW = 'LOW',
    MEDIUM = 'MEDIUM',
    HIGH = 'HIGH',
}

export class Source {
    @ApiProperty({ description: 'ID que representa o ativo do contrato' })
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
}
