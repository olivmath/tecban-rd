import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsObject } from 'class-validator';
import {
    DeployMetadata,
    InteractMetadata,
    Priority,
    Source,
} from '../types/parfin.types';
import { BlockchainId } from '../types/wallet.types';

export class ParfinRegisterContractDTO {
    @ApiProperty({ description: 'Endereço do contrato para registro' })
    @IsString()
    @IsNotEmpty()
    contractAddress: string;

    @ApiProperty({
        description: 'ID da blockchain onde foi criado o contrato',
        enum: ['BLOCKCHAIN_ID'],
        default: BlockchainId.BLOCKCHAIN_ID,
    })
    @IsNotEmpty()
    blockchainId: BlockchainId = BlockchainId.BLOCKCHAIN_ID;
}

export class ParfinRegisterERC20TokenDTO {
    @ApiProperty({ description: 'Endereço do contrato para registro do token' })
    @IsString()
    @IsNotEmpty()
    smartContractAddress: string;

    @ApiProperty({
        description: 'ID da blockchain onde foi criado o contrato',
        enum: ['BLOCKCHAIN_ID'],
        default: BlockchainId.BLOCKCHAIN_ID,
        required: false,
    })
    @IsOptional()
    blockchainId?: BlockchainId = BlockchainId.BLOCKCHAIN_ID;
}

export class ParfinContractInteractDTO {
    @ApiProperty({
        description: 'Tag para representar a insituição cliente da aplicação',
        default: 'Banco Arbi',
        required: false,
    })
    @IsString()
    @IsOptional()
    customerTag?= 'Banco Arbi';

    @ApiProperty({
        description: 'ID para representar a insituição cliente da aplicação',
        default: '3401602e-2953-4790-9109-11d16b844bf4',
        required: false,
    })
    @IsString()
    @IsOptional()
    customerRefId?= '3401602e-2953-4790-9109-11d16b844bf4';

    @ApiProperty({
        description: 'Descrição da interação com o contrato',
        default: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Metadata para a interação com o contrato',
        type: InteractMetadata,
    })
    @IsObject()
    @IsNotEmpty()
    metadata: InteractMetadata;

    @ApiProperty({
        description: 'Informações sobre o ativo do contrato que está sendo interagido com',
        type: Source,
    })
    @IsObject()
    @IsOptional()
    source?: Source;

    @ApiProperty({
        description: 'Prioridade da chamada',
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: Priority.HIGH,
        required: false,
    })
    @IsOptional()
    priority?: Priority = Priority.HIGH;

    @ApiProperty({
        description: 'ID da blocklchain onde será utilizada a carteira',
        enum: ['BLOCKCHAIN_ID'],
        default: BlockchainId.BLOCKCHAIN_ID,
        required: false,
    })
    @IsOptional()
    blockchainId?: BlockchainId = BlockchainId.BLOCKCHAIN_ID;
}