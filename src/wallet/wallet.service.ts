import { TransactionsService } from 'src/transactions/transactions.service';
import ParfinContractWrapper from 'src/utils/contract/contract-wrapper';
import {
    AccountCreateDTO,
    WalletCreateDTO,
    WalletEnableDTO,
} from './dto/wallet.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractHelper } from 'src/helpers/contract/contract';
import { ParfinSuccessRes } from 'src/res/parfin.responses';
import { ParfinService } from 'src/parfin/parfin.service';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './wallet.schema';
import {
    AssetTypes,
    TransactionOperations,
} from 'src/transactions/types/transactions.types';

@Injectable()
export class WalletService {
    keyDictionary: ParfinContractWrapper;
    realDigitalEnableAccount: ParfinContractWrapper;
    realTokenizado: ParfinContractWrapper;
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly contractHelper: ContractHelper,
        private readonly parfinService: ParfinService,
        private readonly transactionService: TransactionsService,
    ) {
        this.keyDictionary = this.contractHelper.getContract('KeyDictionary');
        this.realTokenizado = this.contractHelper.getContract('RealTokenizado');
        this.realDigitalEnableAccount = this.contractHelper.getContract(
            'RealDigitalEnableAccount',
        );
    }

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
        return await this.walletRepository.create(resp);
    }

    async createClientWallet({
        dto: createClientWalletDTO,
    }: {
        dto: AccountCreateDTO;
    }) {
        const { key, taxId, bankNumber, account, branch, wallet } =
            createClientWalletDTO;
        const parfinDTO = createClientWalletDTO as Omit<
            AccountCreateDTO,
            | 'blockchainId'
            | 'key'
            | 'taxId'
            | 'bankNumber'
            | 'account'
            | 'branch'
            | 'wallet'
        >;

        // 1 - pegar endereço do contrato `Key Dictionary`
        parfinDTO.metadata.contractAddress =
            await this.contractHelper.addressDiscovery('KeyDictionary');
        // 2 - codificar a chamada do contrato `Key Dictionary`
        parfinDTO.metadata.data = this.keyDictionary.addAccount(
            key,
            taxId,
            bankNumber,
            account,
            branch,
            wallet,
        )[0];

        try {
            // 3 - Interagir com o contrato usando o endpoint send/write
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            if (transactionId) {
                try {
                    // 4 - Salvar transação no banco
                    const transactionData = {
                        parfinTransactionId: transactionId,
                        operation: TransactionOperations.CREATE_WALLET,
                        asset: null,
                        ...parfinDTO,
                    };
                    const { id: dbTransactionId } =
                        await this.transactionService.create(transactionData);

                    if (dbTransactionId) {
                        try {
                            // 5 - Assinar transação e inserir na blockchain
                            await this.transactionService.transactionSignAndPush(
                                transactionId,
                                dbTransactionId,
                            );
                        } catch (error) {
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de queima de Real Digital / Erro: ${error}`,
                            );
                        }
                    }
                } catch (error) {
                    throw new Error(
                        `Erro ao tentar salvar transação ${transactionId} de queima no banco / Erro: ${error}`,
                    );
                }
            }
        } catch (error) {
            throw new Error(
                `Erro ao tentar criar transação de queima de Real Digital / Erro: ${error}`,
            );
        }
    }

    // Função para habilitar uma carteira
    async enableWallet({ dto }: { dto: WalletEnableDTO }): Promise<any> {
        const { asset, walletAddress } = dto as WalletEnableDTO;
        const parfinDTO = dto as Omit<
            WalletEnableDTO,
            'asset' | 'walletAddress' | 'callMetadata' | 'blockchainId'
        >;

        if (asset === 'RD') {
            parfinDTO.metadata.contractAddress =
                await this.contractHelper.addressDiscovery(
                    'RealDigitalEnableAccount',
                );
            parfinDTO.metadata.data =
                this.realDigitalEnableAccount.enableAccount(walletAddress)[0];

            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.ENABLE_ACCOUNT,
                asset: AssetTypes.RD,
                ...parfinDTO,
            };
            const { id: dbTransactionId } =
                await this.transactionService.create(transactionData);

            return await this.transactionService.transactionSignAndPush(
                transactionId,
                dbTransactionId,
            );
        } else if (asset === 'RT') {
            parfinDTO.metadata.contractAddress =
                await this.contractHelper.addressDiscovery('RealTokenizado');
            parfinDTO.metadata.data =
                this.realTokenizado.enableAccount(walletAddress)[0];

            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            const transactionData = {
                parfinTransactionId: transactionId,
                operation: TransactionOperations.ENABLE_ACCOUNT,
                asset: AssetTypes.RT,
                ...parfinDTO,
            };
            const { id: dbTransactionId } =
                await this.transactionService.create(transactionData);

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
