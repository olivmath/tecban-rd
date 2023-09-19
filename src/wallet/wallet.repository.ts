import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { Wallet, WalletDocument } from '../wallet/wallet.schema';
import { Model } from 'mongoose';
import { WalletDTO } from './dto/wallet-dto';

@Injectable()
export class WalletRepository  {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
  ) {}

  async create(createTokenDTO: WalletDTO): Promise<Wallet> {
    const walletModel = new this.walletModel(createTokenDTO);
    return await walletModel.save();
  }

  async findAll(): Promise<WalletDTO[]> {
    return await this.walletModel.find({ active: true }).exec();
  }

  async findById(id: string): Promise<WalletDTO> {
    return await this.walletModel.findOne({ id, active: true }).exec();
  }

  // Função que chama API da Parfin para criar uma nova carteira
  async createWallet(
    data: any,
  ) {
    try {
      await this.setAuthorizationToken();
      const url = `/wallet`;
      const response = await parfinApi.post(url, data);
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar criar uma nova carteira!`);
    }
  }  
}