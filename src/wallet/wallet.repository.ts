import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from '../wallet/wallet.schema';
import { Model } from 'mongoose';
import {
  WalletCreateDTO
} from './dto/wallet.dto';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) { }

  async create(createWallet: WalletCreateDTO): Promise<Wallet> {
    const walletModel = new this.walletModel(createWallet);
    return await walletModel.save();
  }

  async findAll(): Promise<Wallet[]> {
    return await this.walletModel.find({ enabled: true }).exec();
  }

  async findById(id: string): Promise<Wallet> {
    return await this.walletModel.findOne({ id, active: true }).exec();
  }
}
