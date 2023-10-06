import { Injectable, NotFoundException } from '@nestjs/common';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './wallet.schema';
import { WalletCreateDTO, WalletEnableDTO } from './dto/wallet.dto';

// import keyDictionaryABI from '../ABI/KeyDictionary.abi.json';
import realDigitalEnableAccountABI from '../ABI/RealDigitalEnableAccount.abi.json';
import realTokenizadoABI from '../ABI/RealTokenizado.abi.json';

import { ContractHelper } from 'src/helpers/contract/contract';
import { TransactionsService } from 'src/transactions/transactions.service';
import {
  AssetTypes,
  TransactionOperations,
} from 'src/transactions/types/transactions.types';
import { ParfinService } from 'src/parfin/parfin.service';
import { ParfinSuccessRes } from 'src/res/parfin.responses';

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

    // parfinDTO.metadata = this.contractHelper
    //   .getContract()
    //   .methods.addAccount('lorem')
    //   .encodeABI();

    // const { id: transactionId } = await this.parfinService.smartContractSend(
    //   contractAddress,
    //   parfinDTO,
    // );

    // const transactionData = {
    //   parfinTransactionId: transactionId,
    //   operation: TransactionOperations.CREATE_WALLET,
    //   asset: null,
    //   ...parfinDTO,
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
  async enableWallet({ dto }: {
    dto: WalletEnableDTO;
  }): Promise<any> {
    const { asset, walletAddress } = dto as WalletEnableDTO;
    const parfinDTO = dto as Omit<
      WalletEnableDTO, 'asset' | 'walletAddress' | 'callMetadata' | 'blockchainId'
    >;
    const { contractAddress } = parfinDTO.sendMetadata; // TODO: usar o AddressDiscovery.sol

    if (asset === 'RD') {
      this.contractHelper.setContract(
        realDigitalEnableAccountABI,
        contractAddress,
      );
      parfinDTO.sendMetadata = this.contractHelper
        .getContract()
        .methods.enableAccount(walletAddress)
        .encodeABI();

      const parfinSendRes = await this.parfinService.smartContractSend(parfinDTO);
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.ENABLE_ACCOUNT,
        asset: AssetTypes.RD,
        ...parfinDTO,
      };
      const { id: dbTransactionId } = await this.transactionService.create(
        transactionData,
      );

      return await this.transactionService.transactionSignAndPush(
        transactionId,
        dbTransactionId,
      );
    } else if (asset === 'RT') {
      this.contractHelper.setContract(realTokenizadoABI, contractAddress);
      parfinDTO.sendMetadata = this.contractHelper
        .getContract()
        .methods.enableAccount(walletAddress)
        .encodeABI();

      const parfinSendRes = await this.parfinService.smartContractSend(parfinDTO);
      const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

      const transactionData = {
        parfinTransactionId: transactionId,
        operation: TransactionOperations.ENABLE_ACCOUNT,
        asset: AssetTypes.RT,
        ...parfinDTO,
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
