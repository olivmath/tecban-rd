// transactions.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AssetTypes,
  BlockchainNetwork,
  TransactionOperations,
} from '../types/transactions.types';
import { Priority } from '../types/parfin.types';
import * as crypto from 'node:crypto'

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
  @Prop({
    required: true,
    unique: true,
    index: true,
    default: () => crypto.randomUUID(),
  })
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

  @Prop({ required: false })
  description?: string
}
export const TransactionSchema = SchemaFactory.createForClass(Transaction);
