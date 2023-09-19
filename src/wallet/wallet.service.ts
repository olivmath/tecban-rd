import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { Wallet, WalletDocument } from './wallet.schema';
import { WalletDTO } from './dto/wallet-dto';
import { CreateWalletDTO } from './dto/wallet-dto';

@Injectable()
export class WalletService {
    constructor(private readonly walletRepository: WalletRepository) {}


    // Gravação: Create a new Wallet
    async createInstitutionWallet(walletData: CreateWalletDTO): Promise<Wallet> {

        //chamando a criação de wallet na parfin
        const resp = await this.tokenRepository.createWallet(walletData);

        //salvamos o retorno da parfin no banco
        const wallet = await this.walletRepository.create(walletData);

        return await wallet;
    }

    // Consulta: Retrieve a Wallet by its ID
    async getWalletById(id: string): Promise<WalletDTO> {
        const wallet = await this.walletRepository.findById(id);
        if (!wallet) {
            throw new NotFoundException(`Wallet with ID ${id} not found`);
        }
        return wallet;
    }

    // Listagem: List all Wallets
    async getAllWallets(): Promise<WalletDTO[]> {
        return await this.walletRepository.findAll();
    }
}
