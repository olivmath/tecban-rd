import { TransactionsService } from 'src/transactions/transactions.service';
import ParfinContractWrapper from 'src/utils/contract/contract-wrapper';
import {
    WalletInstitutionCreateDTO,
    WalletClientCreateDTO,
    WalletEnableDTO,
    WalletNewAssetDTO,
} from './dto/wallet.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractHelperService } from 'src/helpers/Contract/contract.service';
import {
    ParfinCreateWalletSuccessRes,
    ParfinErrorRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { ParfinService } from 'src/parfin/parfin.service';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './wallet.schema';
import {
    AssetTypes,
    TransactionOperations,
} from 'src/transactions/types/transactions.types';
import { WalletAddNewAssetSuccessRes } from 'src/res/app/wallet.responses';
import { LoggerService } from 'src/logger/logger.service';

@Injectable()
export class WalletService {
    keyDictionary: ParfinContractWrapper;
    realDigitalEnableAccount: ParfinContractWrapper;
    realTokenizado: ParfinContractWrapper;
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly contractHelper: ContractHelperService,
        private readonly parfinService: ParfinService,
        private readonly transactionService: TransactionsService,
        private readonly logger: LoggerService,
    ) {
        this.keyDictionary =
            this.contractHelper.getContractMethods('KeyDictionary');
        this.realTokenizado =
            this.contractHelper.getContractMethods('RealTokenizado');
        this.realDigitalEnableAccount = this.contractHelper.getContractMethods(
            'RealDigitalEnableAccount',
        );
        this.logger.setContext('WalletService');
    }

    // Gravação: Create a new Wallet
    async createInstitutionWallet(
        dto: WalletInstitutionCreateDTO,
    ): Promise<ParfinCreateWalletSuccessRes | ParfinErrorRes> {
        try {
            // Chamando a criação de wallet na parfin
            const parfinCreateRes = await this.parfinService.createWallet(dto);

            try {
                const wallet = await this.walletRepository.create(
                    parfinCreateRes as Wallet,
                );
                return wallet;
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao tentar criar uma carteira para uma instituição: ${dto.walletName} no banco de dados`,
                );
            }
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro durante a criação de wallet na Parfin: ${error.message}`,
            );
        }
    }

    async createClientWallet(
        dto: WalletClientCreateDTO,
    ): Promise<ParfinCreateWalletSuccessRes | ParfinErrorRes> {
        const { key, taxId, bankNumber, account, branch, wallet } = dto;
        const parfinDTO = dto as Omit<
            WalletClientCreateDTO,
            | 'blockchainId'
            | 'key'
            | 'taxId'
            | 'bankNumber'
            | 'account'
            | 'branch'
            | 'wallet'
        >;

        try {
            // 1 - Pegar endereço do contrato `Key Dictionary`
            parfinDTO.metadata.contractAddress =
                await this.contractHelper.getContractAddress('KeyDictionary');
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                'Erro ao buscar o endereço do contrato: Key Dictionary',
            );
        }

        // 2 - Codificar a chamada do contrato `Key Dictionary`
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

            try {
                const transactionData = {
                    parfinTransactionId: transactionId,
                    operation: TransactionOperations.CREATE_WALLET,
                    asset: null,
                    ...parfinDTO,
                };
                // 4 - Salvar a transação no banco
                const { id: dbTransactionId } =
                    await this.transactionService.create(transactionData);

                try {
                    // 5 - Assinar transação e inserir na blockchain
                    await this.transactionService.transactionSignAndPush(
                        transactionId,
                        dbTransactionId,
                    );

                    try {
                        // Chamando a criação de wallet na Parfin
                        const parfinCreateRes =
                            await this.parfinService.createWallet(dto);
                        return { ...parfinCreateRes };
                    } catch (error) {
                        this.logger.error(error);
                        throw new Error(
                            `Erro ao tentar criar uma carteira para um cliente: ${dto.walletName} no banco de dados`,
                        );
                    }
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        `Erro ao tentar assinar transação ${transactionId} de criação de carteira`,
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao tentar salvar transação ${transactionId} de criação de carteira no banco`,
                );
            }
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar criar transação de criação de carteira`,
            );
        }
    }

    // Função para habilitar uma carteira
    async enableWallet(dto: WalletEnableDTO): Promise<any> {
        const { asset, walletAddress } = dto as WalletEnableDTO;
        const parfinDTO = dto as Omit<
            WalletEnableDTO,
            'asset' | 'walletAddress' | 'blockchainId'
        >;
        if (asset === 'RD') {
            try {
                parfinDTO.metadata.contractAddress =
                    await this.contractHelper.getContractAddress(
                        'RealDigitalEnableAccount',
                    );
                parfinDTO.metadata.data =
                    this.realDigitalEnableAccount.enableAccount(
                        walletAddress,
                    )[0];

                try {
                    const parfinSendRes =
                        await this.parfinService.smartContractSend(parfinDTO);
                    const { id: transactionId } =
                        parfinSendRes as ParfinSuccessRes;

                    const transactionData = {
                        parfinTransactionId: transactionId,
                        operation: TransactionOperations.ENABLE_ACCOUNT,
                        asset: AssetTypes.RD,
                        ...parfinDTO,
                    };
                    try {
                        const { id: dbTransactionId } =
                            await this.transactionService.create(
                                transactionData,
                            );

                        try {
                            return await this.transactionService.transactionSignAndPush(
                                transactionId,
                                dbTransactionId,
                            );
                        } catch (error) {
                            this.logger.error(error);
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de habilitação de conta de Real Digital na Parfin`,
                            );
                        }
                    } catch (error) {
                        this.logger.error(error);
                        throw new Error(
                            `Erro ao tentar salvar transação ${transactionId} de habilitação de conta de Real Digital no banco de dados`,
                        );
                    }
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        `Erro ao tentar enviar transação de habilitação de conta de Real Digital`,
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `Erro ao buscar o contrato 'RealDigitalEnableAccount'`,
                );
            }
        } else if (asset === 'RT') {
            try {
                parfinDTO.metadata.contractAddress =
                    await this.contractHelper.getContractAddress(
                        'RealTokenizado',
                    );
                parfinDTO.metadata.data =
                    this.realTokenizado.enableAccount(walletAddress)[0];

                try {
                    const parfinSendRes =
                        await this.parfinService.smartContractSend(parfinDTO);
                    const { id: transactionId } =
                        parfinSendRes as ParfinSuccessRes;

                    const transactionData = {
                        parfinTransactionId: transactionId,
                        operation: TransactionOperations.ENABLE_ACCOUNT,
                        asset: AssetTypes.RT,
                        ...parfinDTO,
                    };
                    try {
                        const { id: dbTransactionId } =
                            await this.transactionService.create(
                                transactionData,
                            );

                        try {
                            return await this.transactionService.transactionSignAndPush(
                                transactionId,
                                dbTransactionId,
                            );
                        } catch (error) {
                            this.logger.error(error);
                            throw new Error(
                                `Erro ao tentar assinar transação ${transactionId} de habilitação de conta de Real Tokenizado na Parfin`,
                            );
                        }
                    } catch (error) {
                        this.logger.error(error);
                        throw new Error(
                            `Erro ao tentar salvar transação ${transactionId} de habilitação de conta de Real Tokenizado no banco de dados`,
                        );
                    }
                } catch (error) {
                    this.logger.error(error);
                    throw new Error(
                        `Erro ao tentar enviar transação de habilitação de conta de Real Tokenizado`,
                    );
                }
            } catch (error) {
                this.logger.error(error);
                throw new Error(`Erro ao buscar o contrato 'RealTokenizado'`);
            }
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
        try {
            return await this.walletRepository.findAll();
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao buscar todas as carteiras`);
        }
    }

    async addNewAsset(
        dto: WalletNewAssetDTO,
    ): Promise<WalletAddNewAssetSuccessRes | ParfinErrorRes> {
        try {
            const parfinCreateRes = await this.parfinService.addNewAsset(dto);
            return {
                ...parfinCreateRes,
            };
        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar adicionar o Token: ${dto.blockchainTokenId} na carteira: ${dto.walletId}`,
            );
        }
    }
}
