import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './wallet.schema';
import {
  CreateClientWalletDTO,
  EnableWalletDTO,
  WalletDTO,
} from './dto/wallet-dto';
import { CreateWalletDTO } from './dto/wallet-dto';

import keyDictionaryABI from '../ABI/keyDictionaryABI.json';
import realDigitalEnableAccountABI from '../ABI/realDigitalEnableAccountABI.json';
import realTokenizadoABI from '../ABI/realTokenizadoABI.json';
import tpftABI from '../ABI/tpftABI.json';

import { ContractHelper } from 'src/helpers/contract';
import { parfinSendData } from 'src/parfin/mock';
import { TransactionsService } from 'src/transactions/transactions.service';
import { TokenService } from 'src/token/token.service';
import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/dtos/create-transaction.dto';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly contractHelper: ContractHelper,
    private readonly tokenService: TokenService,
    private readonly transactionService: TransactionsService,
  ) {}

  // Gravação: Create a new Wallet
  async createInstitutionWallet(walletData: CreateWalletDTO): Promise<Wallet> {
    //chamando a criação de wallet na parfin
    const resp = await this.walletRepository.createWallet(walletData);

    //salvamos o retorno da parfin no banco
    const wallet = await this.walletRepository.create(resp);

    return wallet;
  }

  // Função para criar uma nova carteira do cliente
  async createClientWallet(
    CreateClientWalletDTO: CreateClientWalletDTO,
  ): Promise<any> {
    //TODO: Implementar lógica para criação de uma nova carteira para um cliente com o contrato KeyDictionary.sol
    const { contractId } = CreateClientWalletDTO;
    await this.contractHelper.setContract(keyDictionaryABI, contractId);

    parfinSendData.metadata = this.contractHelper
      .getContract()
      .methods.addAccount('lorem')
      .encodeABI();
    const { transactionId } = await this.tokenService.smartContractSend(
      contractId,
      parfinSendData,
    );

    const transactionData = {
      parfinTransactionId: transactionId,
      operation: TransactionOperations.CREATE_WALLET,
      asset: null,
      ...parfinSendData,
    };
    const { id: dbTransactionId } = await this.transactionService.create(
      transactionData,
    );

    await this.transactionService.smartContractSignAndPush(
      transactionId,
      dbTransactionId,
    );
    return await this.walletRepository.createWallet(CreateClientWalletDTO);
  }

  // Função para habilitar uma carteira
  async enableWallet({
    contractId,
    dto,
  }: {
    contractId: string;
    dto: EnableWalletDTO;
  }): Promise<any> {
    const { asset, address } = dto as EnableWalletDTO;
    if (asset === 'rd') {
      await this.contractHelper.setContract(
        realDigitalEnableAccountABI,
        contractId,
      );
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.enableAccount(address)
        .encodeABI();
      const { transactionId } = await this.tokenService.smartContractSend(
        contractId,
        parfinSendData,
      );
      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.ENABLE_ACCOUNT,
        asset: AssetTypes.RD,
        ...parfinSendData,
      };
      const { id: dbTransactionId } = await this.transactionService.create(
        transactionData,
      );

      return await this.transactionService.smartContractSignAndPush(
        transactionId,
        dbTransactionId,
      );
    } else if (asset === 'rt') {
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.enableAccount(address)
        .encodeABI();
      const { transactionId } = await this.tokenService.smartContractSend(
        contractId,
        parfinSendData,
      );
      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.ENABLE_ACCOUNT,
        asset: AssetTypes.RT,
        ...parfinSendData,
      };
      const { id: dbTransactionId } = await this.transactionService.create(
        transactionData,
      );

      return await this.transactionService.smartContractSignAndPush(
        transactionId,
        dbTransactionId,
      );
    } else if (asset === 'tpft') {
      await this.contractHelper.setContract(tpftABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.enableAccount(address)
        .encodeABI();
      const { transactionId } = await this.tokenService.smartContractSend(
        contractId,
        parfinSendData,
      );
      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.ENABLE_ACCOUNT,
        asset: AssetTypes.TPFT,
        ...parfinSendData,
      };
      const { id: dbTransactionId } = await this.transactionService.create(
        transactionData,
      );

      return await this.transactionService.smartContractSignAndPush(
        transactionId,
        dbTransactionId,
      );
    }
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
