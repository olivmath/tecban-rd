import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Wallet, WalletDocument } from '../wallet/wallet.schema';
import { Model } from 'mongoose';
import {
  WalletDTO,
  WalletCreateDTO
} from './dto/wallet.dto';
import { parfinApi } from 'src/config/parfin-api-client';
import { PreRequest } from 'src/helpers/pre-request';

@Injectable()
export class WalletRepository {
  constructor(
    @InjectModel(Wallet.name)
    private walletModel: Model<WalletDocument>,
    private preRequest: PreRequest,
  ) { }

  async create(createWalletDTO: WalletDTO): Promise<Wallet> {
    const walletModel = new this.walletModel(createWalletDTO);
    return await walletModel.save();
  }

  async findAll(): Promise<WalletDTO[]> {
    return await this.walletModel.find({ enabled: true }).exec();
  }

  async findById(id: string): Promise<WalletDTO> {
    return await this.walletModel.findOne({ id, active: true }).exec();
  }

  // Função que chama API da Parfin para criar uma nova carteira
  async createWallet({ walletName, blockchainId, walletType }: WalletCreateDTO) {
    const data = {
      walletName,
      blockchainId,
      walletType,
    }
    try {
      await this.preRequest.setAuthorizationToken();
      const url = `/wallet`;
      const response = await parfinApi.post(url, data, {
        headers: {
          'x-api-key': process.env.X_API_KEY,
        },
      });

      return response.data;
    } catch (error) {
      throw new Error(`Erro ao tentar criar uma nova carteira!`);
    }
  }
}
