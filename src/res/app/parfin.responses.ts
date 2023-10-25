import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetwork } from '../../types/transactions.types';
import { WalletAsset, WalletType } from '../../types/wallet.types';

//--- Success
export class ParfinSuccessRes {
    @ApiProperty({ description: 'ID da transação' })
    id: string;
}

export class ParfinCreateWalletSuccessRes {
    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    blockchainNetwork: string;

    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    walletId: string;

    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    address: string;

    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    name: string;

    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    isBlocked: boolean;

    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    blockedMetadataHistory: string[];

    @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
    assets: WalletAsset[];
}

export class ParfinGetWalletSuccessRes {
    @ApiProperty({ description: 'Rede da blockchain a qual a carteira está vinculada' })
    blockchainNetwork: string;
    @ApiProperty({ description: 'Nome da blockchain a qual a carteira está vinculada' })
    blockchainName: string;
    @ApiProperty({ description: 'ID da blockchain a qual a carteira está vinculada' })
    blockchainId: string;
    @ApiProperty({ description: 'ID da carteira na Parfin' })
    walletId: string;
    @ApiProperty({ description: 'Endereço da carteira' })
    address: string;
    @ApiProperty({ description: 'Nome da carteira' })
    name: string;
    @ApiProperty({ description: 'Lista de ativos da carteira' })
    assets: WalletAsset[];
    @ApiProperty({ description: 'Diz se a carteira está habilitada ou não' })
    enabled: boolean;
    @ApiProperty({ description: 'Diz se a carteira está bloqueada ou não' })
    isBlocked: boolean;
    @ApiProperty({ description: 'Histórico de metadata bloqueado' })
    blockedMetadataHistory: string[];
    @ApiProperty({
        description: 'Tipo de carteira',
        enum: ['CUSTODY', 'HOTWALLET']
    })
    walletType: WalletType;
}

export class ParfinGetAllContractsSuccessRes {
    @ApiProperty({ description: 'ID do contrato' })
    id: string;

    @ApiProperty({ description: 'Endereço do contrato' })
    contractAddress: string;

    @ApiProperty({ description: 'ID para representar a insituição cliente da aplicação' })
    customerId: string;

    @ApiProperty({ description: 'ID da blockchain onde foi criado o contrato' })
    blockchainId: string;

    @ApiProperty({ description: 'Data de criação do contrato' })
    createdAt: string;

    @ApiProperty({ description: 'Data de atualização do contrato' })
    updatedAt?: string;
}

export class ParfinRegisterContractSuccessRes extends ParfinSuccessRes {
    @ApiProperty({ description: 'Endereço do contrato para registro' })
    contractAddress: string;

    @ApiProperty({ description: 'ID para representar a insituição cliente da aplicação' })
    customerId: string;

    @ApiProperty({ description: 'ID da blockchain onde foi criado o contrato' })
    blockchainId: string;

    @ApiProperty({ description: 'Data de criação de chamada' })
    createdAt: string;
}

export class ParfinRegisterERC20TokenSuccessRes {
    @ApiProperty({ description: 'ID da transação' })
    id: string;

    @ApiProperty({ description: 'ID da blockchain onde foi criado o contrato' })
    blockchainId: string;

    @ApiProperty({ description: 'Diz se o token é o token nativo da blockchain' })
    isMainBlockchainToken: boolean;

    @ApiProperty({ description: 'Abreviação do token (BTC, ETH, USDT, etc.)' })
    tokenCode: string;

    @ApiProperty({ description: 'Nome do token (Bitcoin, Ethereum, Tether, etc.)' })
    tokenName: string;

    @ApiProperty({ description: 'ID da rede a qual o token pertence' })
    networkTokenId: string;

    @ApiProperty({ description: 'Número de decimais do token' })
    decimals: number;
}

export class ParfinContractCallSuccessRes {
    @ApiProperty({ description: 'Retorno da consulta ao contrato' })
    data: string;
}

export class ParfinGetTransactionSuccessRes {
    @ApiProperty({ description: 'ID da transação registrada na Parfin' })
    parfinId: string;

    @ApiProperty({ description: 'ID do usuário que criou a transação' })
    createdUserId: string;

    @ApiProperty({ description: 'Tag do cliente' })
    customerTag: string;

    @ApiProperty({ description: 'ID de referência do cliente' })
    customerRefId: string;

    @ApiProperty({ description: 'ID da carteira' })
    walletId: string;

    @ApiProperty({ description: 'ID do ativo' })
    assetId: string;

    @ApiProperty({ description: 'Data de criação da transação' })
    createdAt: string;

    @ApiProperty({ description: 'Valor da transação' })
    amount: number;

    @ApiProperty({ description: 'Taxa da transação' })
    fee: number;

    @ApiProperty({ description: 'Fontes da transação' })
    sources: string[];

    @ApiProperty({ description: 'Destinos da transação' })
    destinations: string[];

    @ApiProperty({ description: 'Ativo da transação' })
    asset: string;

    @ApiProperty({ description: 'Descrição da transação' })
    description: string;

    @ApiProperty({ description: 'Direção da transação' })
    direction: string;

    @ApiProperty({ description: 'Rede blockchain' })
    blockchainNetwork: BlockchainNetwork;

    @ApiProperty({ description: 'Preferência da transação' })
    preference: string;

    @ApiProperty({ description: 'Status da transação' })
    status: string;

    @ApiProperty({ description: 'Descrição do status da transação' })
    statusDescription: string;

    @ApiProperty({ description: 'Transação bruta' })
    rawTransaction: string;

    @ApiProperty({ description: 'ID da blockchain' })
    blockchainId: string;

    @ApiProperty({ description: 'ID do token na blockchain' })
    blockchainTokenId: string;

    @ApiProperty({ description: 'Carga da transação Parfin' })
    parfinTransactionPayload: string;
}

export class ParfinGetAllTransactionsSuccessRes {
    @ApiProperty({ description: 'Transações registradas na Parfin' })
    transactions: ParfinGetTransactionSuccessRes[];
}

//--- Errors
export class ParfinErrorRes {
    @ApiProperty({ description: 'Mensagem de erro' })
    message: string;

    @ApiProperty({ description: 'Detalhe do erro' })
    detail: string;

    @ApiProperty({ description: 'Horário do erro' })
    timestamp: string;

    @ApiProperty({ description: 'Path da requisição' })
    path: string;

    @ApiProperty({ description: 'Código do erro' })
    errorCode: string;

    @ApiProperty({ description: 'Mensagens de erro' })
    errors: string[];
}