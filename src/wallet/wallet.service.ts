import { TransactionsService } from 'src/transactions/transactions.service';
import ParfinContractWrapper from 'src/utils/contract-util/contract-wrapper';
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
        dto: WalletCreateDTO,
    ): Promise<WalletCreateSuccessRes | any> {
        try {
            // 1. Criando a carteira na Parfin
            const parfinCreateRes = await this.parfinService.createWallet(dto);
            const { walletId } = parfinCreateRes as ParfinCreateWalletSuccessRes;
            if (!walletId) {
                this.logger.error(parfinCreateRes);
                throw new Error(
                    `[ERROR]: Erro ao tentar criar a carteira ${dto.walletName} na Parfin. Parfin DTO: ${dto}`
                );
            }

            // 2. Criando a carteira no banco de dados
            const payload = {
                ...parfinCreateRes,
                bacenEnabled: false,
                ownerId: process.env.ARBI_ID,
                ownerType: OwnerType.INSTITUTION
            } as Wallet
            const wallet = await this.walletRepository.create(payload);
            if (!wallet.id) {
                this.logger.error(wallet);
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

    async createClientWallet(
        dto: WalletClientCreateDTO,
    ): Promise<WalletCreateClientSuccessRes | any> {
        const {
            description,
            assetId,
            ownerId,
            walletName,
            taxId,
            bankNumber,
            account,
            branch,
            walletType
        } = dto;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;
        parfinSendDTO.source = { assetId };

        const w3 = new Web3();

        try {
            // 1. Criando a carteira na Parfin
            const parfinCreateRes = await this.parfinService.createWallet({ walletName, blockchainId, walletType })
            const { address: walletAddress, walletId } = parfinCreateRes as ParfinCreateWalletSuccessRes
            if (!walletId) {
                this.logger.error(parfinCreateRes);
                throw new Error(
                    `[ERROR]: Erro ao tentar criar a carteira ${dto.walletName} na Parfin. Parfin DTO: ${dto}`
                );
            }

            // // 2. Pegar endereço do contrato `Key Dictionary`
            const { address: contractAddress } = await this.contractHelper.getContractAddress('KeyDictionary');
            if (!contractAddress) {
                throw new Error(
                    `[ERROR]: Erro ao buscar o endereço do contrato Key Dictionary`,
                );
            }

            // 3. Codificar a chamada do contrato `Key Dictionary`
            const clientKey = w3.utils.keccak256(dto.taxId.toString())
            parfinSendDTO.metadata = {
                contractAddress: contractAddress,
                data: this.keyDictionary['addAccount(bytes32,uint256,uint256,uint256,uint256,address)'](
                    clientKey,
                    taxId,
                    bankNumber,
                    account,
                    branch,
                    walletAddress,
                )[0]
            }

            // 4. Interagir com o contrato usando o endpoint send/write
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;
            if (!transactionId) {
                const payload = JSON.stringify(parfinSendDTO)
                throw new Error(
                    `[ERROR]: Erro ao tentar interagir com contrato Key Dictionary. Parfin Send DTO: ${payload}`
                );
            }
            await this.parfinService.transactionSignAndPush(transactionId);

            // 5. Criando a carteira no banco de dados
            const payload = {
                ...parfinCreateRes,
                bacenEnabled: false,
                ownerId: process.env.ARBI_ID,
                ownerType: OwnerType.INSTITUTION
            } as Wallet
            const wallet = await this.walletRepository.create(payload);
            if (!wallet.id) {
                this.logger.error(wallet);
                throw new Error(
                    `[ERROR]: Erro ao tentar criar a carteira ${dto.walletName} no banco de dados. Payload: ${payload}`
                );
            }

            return {
                ...wallet,
                clientKey: clientKey,
            }

        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `[ERROR]: Erro ao tentar criar uma carteira de um cliente ${dto.walletName}`,
            );
        }
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
                const realDigitalEnableAccount = 'RealDigitalEnableAccount';
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
