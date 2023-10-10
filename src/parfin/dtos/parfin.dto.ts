import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import {
    DeployMetadata,
    InteractMetadata,
    Priority,
    Source,
} from '../types/parfin.types';
import { BlockchainId } from 'src/wallet/types/wallet.types';
export class ParfinDeployContractDTO {
    @ApiProperty({
        description: 'Tag para representar a insituição cliente da aplicação',
        default: null,
    })
    @IsString()
    @IsOptional()
    customerTag?: string;

    @ApiProperty({
        description: 'ID para representar a insituição cliente da aplicação',
        default: null,
    })
    @IsString()
    @IsOptional()
    customerRefId?: string;

    @ApiProperty({
        description: 'Descrição do contrato',
        default: null,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Informações sobre o ativo do contrato' })
    @IsObject()
    source: Source;

    @ApiProperty({ description: 'Metadata do contrato para o deploy' })
    @IsObject()
    metadata: DeployMetadata;

    @ApiProperty({
        description: 'Prioridade da chamada',
        enum: Priority,
        enumName: 'Priority',
        default: Priority.HIGH,
    })
    @IsString()
    @IsNotEmpty()
    priority: Priority = Priority.HIGH;
}

export class ParfinRegisterContractDTO {
    @ApiProperty({ description: 'Endereço do contrato para registro' })
    @IsString()
    @IsNotEmpty()
    contractAddress: string;

    @ApiProperty({ description: 'ID da blockchain onde foi criado o contrato' })
    @IsString()
    @IsNotEmpty()
    blockchainId: string;
}

export class ParfinContractInteractDTO {
    @ApiProperty({
        description: 'Tag para representar a insituição cliente da aplicação',
        default: 'Banco Arbi',
    })
    @IsString()
    @IsOptional()
    customerTag? = 'Banco Arbi';

    @ApiProperty({
        description: 'ID para representar a insituição cliente da aplicação',
        default: '3401602e-2953-4790-9109-11d16b844bf4',
    })
    @IsString()
    @IsOptional()
    customerRefId? = '3401602e-2953-4790-9109-11d16b844bf4';

    @ApiProperty({
        description: 'Descrição da interação com o contrato',
        default: null,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'Metadata para a interação com o contrato' })
    @IsObject()
    @IsOptional()
    metadata: InteractMetadata;

    @ApiProperty({
        description: 'ID da blocklchain onde será utilizada a carteira',
        enum: BlockchainId,
        enumName: 'BlockchainId',
        default: BlockchainId.BLOCKCHAIN_ID,
    })
    @IsString()
    @IsOptional()
    blockchainId?: BlockchainId = BlockchainId.BLOCKCHAIN_ID;

    @ApiProperty({ description: 'Informações sobre o ativo do contrato' })
    @IsOptional()
    source?: Source;

    @ApiProperty({
        description: 'Prioridade da chamada',
        enum: Priority,
        enumName: 'Priority',
        default: Priority.HIGH,
    })
    @IsString()
    @IsNotEmpty()
    priority?: Priority = Priority.HIGH;
}


