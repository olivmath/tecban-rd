import { ApiProperty } from '@nestjs/swagger';
import { WalletAsset } from 'src/wallet/types/wallet.types';

export class ParfinSuccessRes {
  @ApiProperty({ description: 'ID da transação de deploy da Parfin' })
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
  updatedAt: string;
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

export class ParfinContractCallSuccessRes {
  @ApiProperty({ description: 'Retorno da consulta ao contrato' })
  data: string;
}

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