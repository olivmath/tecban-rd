// create-transaction.dto.ts
import { IsString, IsEnum, IsOptional } from 'class-validator';

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
  ENABLE_ACCOUNT = 'EnableAccount',
  CREATE_WALLET = 'CreateWallet',
}

export enum AssetTypes {
  RD = 'RD',
  RT = 'RT',
  TPFT = 'TPFT',
}

export class TransactionDTO {
  @IsString()
  parfinTransactionId: string;

  @IsString()
  customerTag: string;

  @IsString()
  customerRefId: string;

  @IsString()
  asset: AssetTypes | null;

  @IsString()
  source: {
    assetId: string;
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
