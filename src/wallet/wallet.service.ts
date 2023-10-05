import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './wallet.schema';
import { WalletCreateDTO, WalletEnableDTO } from './dto/wallet.dto';

// import keyDictionaryABI from '../ABI/KeyDictionary.abi.json';
import realDigitalEnableAccountABI from '../ABI/RealDigitalEnableAccount.abi.json';
import realTokenizadoABI from '../ABI/RealTokenizado.abi.json';

import { ContractHelper } from 'src/helpers/contract';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/types/transactions.types';
import { ParfinService } from 'src/parfin/parfin.service';

@Injectable()
export class WalletService {
  constructor(
    private readonly walletRepository: WalletRepository,
    private readonly contractHelper: ContractHelper,
    private readonly parfinService: ParfinService,
    private readonly transactionService: TransactionsService,
  ) { }

  // Gravação: Create a new Wallet
  async createInstitutionWallet({
    dto: createInstitutionWalletDTO,
  }: {
    dto: WalletCreateDTO;
  }): Promise<Wallet> {
    //chamando a criação de wallet na parfin
    const resp = await this.parfinService.createWallet(
      createInstitutionWalletDTO,
    );
    //salvamos o retorno da parfin no banco
    const wallet = await this.walletRepository.create(resp);

    return wallet;
  }

  // Função para criar uma nova carteira do cliente
  async createClientWallet({
    dto: createClientWalletDTO,
  }: {
    dto: WalletCreateDTO;
  }): Promise<any> {
    //TODO: Implementar lógica para criação de uma nova carteira para um cliente com o contrato KeyDictionary.sol
    // const { walletName, blockchainId, walletType } = createClientWalletDTO;

    // this.contractHelper.setContract(keyDictionaryABI);

    // parfinSendData.metadata = this.contractHelper
    //   .getContract()
    //   .methods.addAccount('lorem')
    //   .encodeABI();

    // const { id: transactionId } = await this.parfinService.smartContractSend(
    //   contractId,
    //   parfinSendData,
    // );

    // const transactionData = {
    //   parfinTransactionId: transactionId,
    //   operation: TransactionOperations.CREATE_WALLET,
    //   asset: null,
    //   ...parfinSendData,
    // };
    // const { id: dbTransactionId } = await this.transactionService.create(
    //   transactionData,
    // );

    // await this.transactionService.transactionSignAndPush(
    //   transactionId,
    //   dbTransactionId,
    // );
    // return await this.walletRepository.createWallet({
    //   walletName,
    //   blockchainId,
    //   walletType,
    // });
    console.log();
  }

  // Função para habilitar uma carteira
  async enableWallet({
    contractId,
    dto,
  }: {
    contractId: string;
    dto: WalletEnableDTO;
  }): Promise<any> {
    const { asset, address } = dto as WalletEnableDTO;
    if (asset === 'RD') {
      await this.contractHelper.setContract(
        realDigitalEnableAccountABI,
        contractId,
      );
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.enableAccount(address)
        .encodeABI();
      const { id: transactionId } = await this.parfinService.smartContractSend(
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

      return await this.transactionService.transactionSignAndPush(
        transactionId,
        dbTransactionId,
      );
    } else if (asset === 'RT') {
      await this.contractHelper.setContract(realTokenizadoABI, contractId);
      parfinSendData.metadata = this.contractHelper
        .getContract()
        .methods.enableAccount(address)
        .encodeABI();
      const { id: transactionId } = await this.parfinService.smartContractSend(
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

      return await this.transactionService.transactionSignAndPush(
        transactionId,
        dbTransactionId,
      );
    } else if (asset === 'TPFT') {
      console.log('');
      // TODO: Implementar lógica de habilitação para receber TPFt aqui
    }
  }

  // Consulta: Retrieve a Wallet by its ID
  async getWalletById(id: string): Promise<Wallet> {
    const wallet = await this.walletRepository.findById(id);
    if (!wallet) {
      throw new NotFoundException(`Wallet with ID ${id} not found`);
    }
    return wallet;
  }

  // Listagem: List all Wallets
  async getAllWallets(): Promise<Wallet[]> {
    return await this.walletRepository.findAll();
  }
}
