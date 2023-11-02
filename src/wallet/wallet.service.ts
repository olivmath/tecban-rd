import { TransactionsService } from 'src/transactions/transactions.service';
import ParfinContractWrapper from 'src/utils/contract-util/contract-wrapper';
import {
    WalletInstitutionCreateDTO,
    WalletClientCreateDTO,
    WalletEnableDTO,
    WalletNewAssetDTO,
} from '../dtos/wallet.dto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
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
} from '../types/transactions.types';
import { CreateClientWalletRes, WalletAddNewAssetSuccessRes } from 'src/res/app/wallet.responses';
import { LoggerService } from 'src/logger/logger.service';
import { AssetID, OwnerType } from '../types/wallet.types';
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
        dto: WalletInstitutionCreateDTO,
    ): Promise<ParfinCreateWalletSuccessRes | ParfinErrorRes> {
        try {
            // Chamando a criação de wallet na parfin
            const parfinCreateRes = await this.parfinService.createWallet(dto);

            try {
                const wallet = await this.walletRepository.create(
                    { ...parfinCreateRes, ownerType: OwnerType.INSTITUTION } as Wallet,
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
    ): Promise<CreateClientWalletRes> {
        const { walletName, taxId, bankNumber, account, branch, blockchainId, walletType } = dto;
        const parfinSendDTO = new ParfinContractInteractDTO()
        const w3 = new Web3()



        try {
            // create wallet in parfin
            const res = await this.parfinService.createWallet({ walletName, blockchainId, walletType })
            const { address: walletAddress, walletId } = res as ParfinCreateWalletSuccessRes


            // 1 - Pegar endereço do contrato `Key Dictionary`
            const { address: contractAddress } = await this.contractHelper.getContractAddress('KeyDictionary');
            if (!contractAddress) {
                throw new Error(
                    'Erro ao buscar o endereço do contrato: Key Dictionary',
                );
            }

            const key = w3.utils.keccak256(dto.taxId.toString())
            // 2 - Codificar a chamada do contrato `Key Dictionary`
            parfinSendDTO.metadata = {
                contractAddress: contractAddress,
                data: this.keyDictionary['addAccount(bytes32,uint256,uint256,uint256,uint256,address)'](
                    key,
                    taxId,
                    bankNumber,
                    account,
                    branch,
                    walletAddress,
                )[0]
            }
            // 3 - Interagir com o contrato usando o endpoint send/write
            const parfinSendRes = await this.parfinService.smartContractSend(
                parfinSendDTO,
            );
            const { id: transactionId } = parfinSendRes as ParfinSuccessRes;

            await this.parfinService.transactionSignAndPush(transactionId)

            // TODO: save wallet in database

            return {
                wallet: walletAddress,
                walletId: walletId,
                clientKey: key,
            }

        } catch (error) {
            this.logger.error(error);
            throw new Error(
                `Erro ao tentar criar transação de criação de carteira`,
            );
        }
    }



    async enableWallet(dto: WalletEnableDTO): Promise<any> {
        const { description, asset, walletAddress } = dto;
        const parfinDTO = new ParfinContractInteractDTO();
        const { blockchainId, ...parfinSendDTO } = parfinDTO;
        parfinSendDTO.description = description;

        if (asset === 'RD') {
            parfinSendDTO.source = {
                assetId: AssetID.realDigital,
            };

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

                return statusDescription;
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `[ERROR]: Erro ao tentar habilitar a carteira ${walletAddress}. Parfin Send DTO: ${parfinSendDTO}`
                );
            }
        } else if (asset === 'RT') {
            parfinSendDTO.source = {
                assetId: AssetID.realTokenizado,
            };

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

                return statusDescription;
            } catch (error) {
                this.logger.error(error);
                throw new Error(
                    `[ERROR]: Erro ao tentar habilitar a carteira ${walletAddress}. Parfin Send DTO: ${parfinSendDTO}`
                );
            }
        } else if (asset === 'TPFT') {
            parfinSendDTO.source = {
                assetId: AssetID.tpft,
            };
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
