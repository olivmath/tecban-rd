import { TransactionsService } from 'src/transactions/transactions.service';
import {
    WalletCreateDTO,
    WalletClientCreateDTO,
    WalletEnableDTO,
    WalletNewAssetDTO,
} from '../dtos/wallet.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import {
    ParfinCreateWalletSuccessRes,
    ParfinSuccessRes,
} from 'src/res/app/parfin.responses';
import { ParfinService } from 'src/parfin/parfin.service';
import { WalletRepository } from './wallet.repository';
import { Wallet } from './wallet.schema';
import {
    AssetTypes,
    TransactionOperations,
} from '../types/transactions.types';
import {
    WalletCreateSuccessRes,
    WalletCreateClientSuccessRes,
    WalletAddNewAssetSuccessRes
} from 'src/res/app/wallet.responses';
import { LoggerService } from 'src/logger/logger.service';
import { OwnerType } from '../types/wallet.types';
import { ParfinContractInteractDTO } from 'src/dtos/parfin.dto';
import Web3 from 'web3';
import WrapperContractABI from 'src/helpers/contract-helper/contract-helper.wrapper';

@Injectable()
export class WalletService {
    keyDictionary: WrapperContractABI;
    realDigitalEnableAccount: WrapperContractABI;
    realTokenizado: WrapperContractABI;
    constructor(
        private readonly walletRepository: WalletRepository,
        private readonly contractHelper: ContractHelperService,
        private readonly parfinService: ParfinService,
        private readonly transactionService: TransactionsService,
        private readonly logger: LoggerService,
    ) {
        this.keyDictionary = this.contractHelper.getContractMethods('KEY_DICTIONARY');
        this.realTokenizado = this.contractHelper.getContractMethods('REAL_TOKENIZADO');
        this.realDigitalEnableAccount = this.contractHelper.getContractMethods('REAL_DIGITAL_ENABLE_ACCOUNT');
        this.logger.setContext('WalletService');
    }

    // Gravação: Create a new Wallet
    async createInstitutionWallet(
        dto: WalletCreateDTO,
    ): Promise<WalletCreateSuccessRes | any> {
        try {
            // 1. Criando a carteira na Parfin
            const parfinCreateRes = await this.parfinService.createWallet(dto);
            const { walletId } = parfinCreateRes as ParfinCreateWalletSuccessRes;
            if (!walletId) {
                throw new Error(
                    `[ERROR]: Erro ao tentar criar a carteira ${dto.walletName} na Parfin. Parfin DTO: ${dto}`
                );
            }

            // 2. Criando a carteira no banco de dados
            const payload = {
                ...parfinCreateRes,
                bacenEnabled: false,
                ownerId: process.env.ARBI_USER_ID,
                ownerType: OwnerType.INSTITUTION
            } as Wallet
            const wallet = await this.walletRepository.create(payload);
            if (!wallet.id) {
                throw new Error(
                    `[ERROR]: Erro ao tentar criar a carteira ${dto.walletName} no banco de dados. Payload: ${payload}`
                );
            }
            return wallet;

        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro durante a criação de wallet na Parfin: ${error.message}`,
            );
        }
    }

    async createClientWallet(dto: WalletClientCreateDTO): Promise<WalletCreateClientSuccessRes | any> {
        const { description, assetId, walletName, taxId, bankNumber, account, branch, walletType } = dto;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        const w3 = new Web3();

        // 1. Criando a carteira na Parfin
        const { address: wallet, walletId } = await this.parfinService.createWallet({ walletName, blockchainId, walletType });

        // 2. Pegar endereço do contrato `Key Dictionary`
        const { address: contractAddress } = this.contractHelper.getContractAddress('KEY_DICTIONARY');

        // 3. Codificar a chamada do contrato `Key Dictionary`
        const clientKey = w3.utils.keccak256(dto.taxId.toString());
        parfinSendDTO.metadata = {
            contractAddress: contractAddress,
            data: this.keyDictionary['addAccount(bytes32,uint256,uint256,uint256,uint256,address)'](
                clientKey,
                taxId,
                bankNumber,
                account,
                branch,
                wallet,
            )[0],
        };

        // 4. Interagir com o contrato usando o endpoint send/write
        const parfinSendRes = await this.parfinService.smartContractSend(parfinSendDTO);
        const { id: parfinTxId } = parfinSendRes as ParfinSuccessRes;

        return {
            clientKey,
            wallet,
            parfinTxId,
            walletId,
        };
    }

    async enableWallet(dto: WalletEnableDTO): Promise<any> {
        const { description, asset, assetId, walletAddress } = dto;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = {
            assetId,
        };

        if (asset === 'RD') {
            try {
                // 1. ???
                const realDigitalEnableAccount = 'REAL_DIGITAL_ENABLE_ACCOUNT';
                const { address } = await this.contractHelper.getContractAddress(realDigitalEnableAccount);
                if (!address) {
                    throw new Error(`[ERROR]: Erro ao buscar o contrato ${realDigitalEnableAccount}`);
                }

                // 2. ???
                parfinSendDTO.metadata = {
                    data: '',
                    contractAddress: address,
                };
                parfinSendDTO.metadata.data =
                    this.realDigitalEnableAccount['enableAccount(address)'](
                        walletAddress,
                    )[0];

                // 3. ???
                const parfinSendRes = await this.parfinService.smartContractSend(
                    parfinSendDTO,
                );
                const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
                if (!transactionId) {
                    throw new Error(
                        `[ERROR]: Erro ao tentar interagir com contrato ${realDigitalEnableAccount}. Parfin Send DTO: ${parfinSendDTO}`
                    );
                }

                // 4. ???
                const transactionData = {
                    parfinTransactionId: transactionId,
                    operation: TransactionOperations.ENABLE_ACCOUNT,
                    asset: AssetTypes.RD,
                    ...parfinSendDTO,
                };

                const { id: dbTransactionId } =
                    await this.transactionService.create(transactionData);
                if (!dbTransactionId) {
                    throw new Error(
                        `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                    );
                }

                // 5. ???
                const { statusDescription } = await this.transactionService.transactionSignAndPush(
                    transactionId,
                    dbTransactionId,
                );
                if (!statusDescription) {
                    throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
                }

                return {
                    parfinId: transactionId,
                    status: statusDescription
                };
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `[ERROR]: Erro ao tentar habilitar a carteira ${walletAddress}. Parfin Send DTO: ${parfinSendDTO}`
                );
            }
        } else if (asset === 'RT') {
            try {
                // 1. ???
                const address = process.env.REAL_TOKENIZADO_ADDRESS;

                // 2. ???
                parfinSendDTO.metadata = {
                    data: '',
                    contractAddress: address,
                };
                parfinSendDTO.metadata.data =
                    this.realTokenizado['enableAccount(address)'](
                        walletAddress,
                    )[0];

                // 3. ???
                const parfinSendRes = await this.parfinService.smartContractSend(
                    parfinSendDTO,
                );
                const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
                if (!transactionId) {
                    throw new Error(
                        `[ERROR]: Erro ao tentar interagir com contrato Real Tokenizado. Parfin Send DTO: ${parfinSendDTO}`
                    );
                }

                // 4. ???
                const transactionData = {
                    parfinTransactionId: transactionId,
                    operation: TransactionOperations.MINT,
                    asset: AssetTypes.RT,
                    ...parfinSendDTO,
                };

                const { id: dbTransactionId } =
                    await this.transactionService.create(transactionData);
                if (!dbTransactionId) {
                    throw new Error(
                        `[ERROR]: Erro ao tentar salvar a transação ${transactionId} no banco. Payload: ${transactionData}`
                    );
                }

                // 5. ???
                const { statusDescription } = await this.transactionService.transactionSignAndPush(
                    transactionId,
                    dbTransactionId,
                );
                if (!statusDescription) {
                    throw new Error(`[ERROR]: Erro ao tentar assinar a transação ${transactionId}. Payload: ${transactionData}`);
                }

                return {
                    parfinId: transactionId,
                    status: statusDescription
                };
            } catch (error) {
                const payload = JSON.stringify(parfinSendDTO)
                this.logger.error(error);
                throw new Error(
                    `[ERROR]: Erro ao tentar habilitar a carteira ${walletAddress}. Parfin Send DTO: ${payload}`
                );
            }
        } else if (asset === 'TPFT') {
            console.log('');
            // TODO: Implementar lógica de habilitação para receber TPFt aqui
        }
    }

    // Consulta: Retrieve a Wallet by its ID
    async getWalletById(id: string): Promise<Wallet | any> {
        const wallet = await this.walletRepository.findById(id);
        if (!wallet) {
            throw new NotFoundException(`Wallet with ID ${id} not found`);
        }
        return wallet;
    }

    // Listagem: List all Wallets
    async getAllWallets(): Promise<Wallet[] | any> {
        try {
            return await this.walletRepository.findAll();
        } catch (error) {
            this.logger.error(error);
            throw new Error(`Erro ao buscar todas as carteiras`);
        }
    }

    async addNewAsset(
        dto: WalletNewAssetDTO,
    ): Promise<WalletAddNewAssetSuccessRes | any> {
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
