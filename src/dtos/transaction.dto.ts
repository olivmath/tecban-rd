// create-transaction.dto.ts
import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import {
    InteractMetadata,
    Priority,
    Source,
} from '../types/parfin.types';
import {
    AssetTypes,
    BlockchainNetwork,
    TransactionOperations,
} from '../types/transactions.types';
import { BlockchainId } from '../types/wallet.types';

export class TransactionDTO {
    @IsString()
    parfinTransactionId: string;

    @IsString()
    customerTag?: string;

    @IsString()
    customerRefId?: string;

    @IsString()
    asset: AssetTypes | null;

    @IsString()
    source?: Source;

    @IsString()
    operation: TransactionOperations;

    @IsObject()
    metadata?: InteractMetadata;

    @IsEnum(Priority)
    priority?: Priority;

    @IsEnum(BlockchainNetwork)
    @IsOptional()
    blockchainNetwork?: BlockchainNetwork;

    @IsEnum(BlockchainId)
    @IsOptional()
    blockchainId?: BlockchainId;

    @IsString()
    @IsOptional()
    statusDescription?: string;
}
