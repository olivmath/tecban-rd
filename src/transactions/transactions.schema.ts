// transactions.entity.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import {
  AssetTypes,
  BlockchainNetwork,
  TransactionOperations,
} from './types/transactions.types';
import { Priority } from 'src/parfin/types/parfin.types';
import { AssetID } from 'src/wallet/types/wallet.types';

@Schema()
class Source {
  @Prop()
  assetId: AssetID;

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
