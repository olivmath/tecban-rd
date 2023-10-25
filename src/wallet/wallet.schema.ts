import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as crypto from 'crypto';
import { OwnerType, WalletAsset, WalletType } from '../types/wallet.types';

export type WalletDocument = Wallet & Document;

@Schema({ timestamps: true, versionKey: false, strictQuery: false })
export class Wallet {
    @Prop({
        required: true,
        unique: true,
        index: true,
        default: () => crypto.randomUUID(),
    })
    id: string;

    @Prop({ required: true })
    blockchainNetwork: string;

    @Prop({ required: true })
    blockchainName: string;

    @Prop({ required: true })
    blockchainId: string;

    @Prop({ required: true })
    walletId: string;

    @Prop({ required: true })
    address: string;

    @Prop({ required: true })
    name: string;

    @Prop({ type: [Object] })
    assets: WalletAsset[];

    @Prop({ required: true, default: false })
    enabled: boolean;

    @Prop({ required: true, default: false })
    isBlocked: boolean;

    @Prop({ type: [String], default: [] })
    blockedMetadataHistory: string[];

    @Prop({ required: true })
    walletType: WalletType;

    @Prop({ required: true })
    ownerId: string;

    @Prop({ required: true })
    ownerType: OwnerType;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);
