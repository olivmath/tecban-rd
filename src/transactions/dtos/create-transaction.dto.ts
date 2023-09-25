// create-transaction.dto.ts
import {
  IsString,
  IsNumber,
  IsDate,
  IsEnum,
  IsOptional,
} from 'class-validator';

export enum Priority {
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW',
}

export enum BlockchainNetwork {
  Mainnet = 'Mainnet',
  Testnet = 'Testnet',
}

export enum TransactionOperations {
  MINT = 'Mint',
  BURN = 'Burn',
  TRANSFER = 'Transfer',
}

export enum AssetTypes {
  RD = 'rd',
  RT = 'rt',
  TPFT = 'tpft',
}

export class CreateTransactionDto {
  @IsString()
  parfinTransactionId: string;

  @IsString()
  customerTag: string;

  @IsString()
  customerRefId: string;

  @IsString()
  asset: AssetTypes;

  @IsString()
  source: {
    assetId: string;
    walletId: string;
  };

  @IsString()
  @IsString()
  operation: TransactionOperations;

  @IsString()
  metadata: {
    data: string;
    contractAddress: string;
  };

  @IsEnum(Priority)
  priority: Priority;

  @IsEnum(BlockchainNetwork)
  @IsOptional()
  blockchainNetwork?: BlockchainNetwork;

  @IsString()
  @IsOptional()
  statusDescription?: string;
}
