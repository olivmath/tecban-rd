// transactions.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AssetTypes,
  BlockchainNetwork,
  Priority,
  TransactionOperations,
} from './dtos/create-transaction.dto';

@Schema()
class Source {
  @Prop()
  assetId: string;

  @Prop()
  walletId: string;
}

@Schema()
class Metadata {
  @Prop()
  data: string;

  @Prop()
  contractAddress: string;
}

@Schema()
export class Transaction extends Document {
  @Prop()
  id: string;

  @Prop()
  parfinTransactionId: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  operation: TransactionOperations;

  @Prop()
  customerTag: string;

  @Prop()
  customerRefId: string;

  @Prop()
  asset: AssetTypes | null;

  @Prop({ type: Source })
  source: Source;

  @Prop({ type: Metadata })
  metadata: Metadata;

  @Prop()
  priority: Priority;

  @Prop()
  blockchainNetwork: BlockchainNetwork;

  @Prop()
  statusDescription: string;
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
