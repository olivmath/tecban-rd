import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeployContractDTO {
  @ApiProperty({ description: 'Contract Id' })
  contractId: string;

  @ApiProperty({ description: 'Transaction Hash' })
  transactionHash: string;
}

export class DeployContractDTO {
  @ApiProperty({ description: 'Customer tag' })
  customerTag: string;

  @ApiProperty({ description: 'Customer reference ID' })
  customerRefId: string;

  @ApiProperty({ description: 'Description' })
  description: string;

  @ApiProperty({ description: 'Source asset ID' })
  assetId: string;

  @ApiProperty({ description: 'Source wallet ID' })
  walletId: string;

  @ApiProperty({ description: 'Contract metadata ABI' })
  abi: string;

  @ApiProperty({ description: 'Contract metadata byte code' })
  byteCode: string;

  @ApiProperty({ description: 'Contract metadata parameters' })
  parameters: any[];
}

export class ResponseWalletDTO {
  @ApiProperty({ description: 'Nome da carteira' })
  walletName: string;

  @ApiProperty({ description: 'ID da blockchain' })
  blockchainId: string;

  @ApiProperty({ description: 'Tipo de carteira' })
  walletType: string;
}

export class EnableWalletDTO {
  @ApiProperty({ description: 'Ativo da carteira' })
  asset: string;

  @ApiProperty({ description: 'Endereço da carteira' })
  address: string;
}

export class MintDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  asset: string;

  @ApiProperty({ description: 'Endereço do destinatário' })
  to?: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  amount: number;
}

export class BurnDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  asset: string;

  @ApiProperty({ description: 'Quantidade a ser queimada' })
  amount: number;

  @ApiProperty({ description: 'Endereço da carteira' })
  from: string;
}

export class TransferDTO {
  @ApiProperty({ description: 'Tipo de ativo' })
  asset: string;

  @ApiProperty({ description: 'CNPJ do destinatário' })
  cnpj: string;

  @ApiProperty({ description: 'Endereço do destinatário' })
  to: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  amount: number;
}

export class ContractDTO {
  @ApiProperty({ description: 'Transaction hash' })
  transactionHash: string;

  @ApiProperty({ description: 'Customer ID' })
  customerId: string;

  @ApiProperty({ description: 'Blockchain ID' })
  blockchainId: string;

  @ApiProperty({ description: 'Contract address' })
  contractAddress: string;

  @ApiProperty({ description: 'ABI' })
  abi: string;

  @ApiProperty({ description: 'Byte code' })
  byteCode: string;

  @ApiProperty({ description: 'Parameters' })
  parameters: string[];

  @ApiProperty({ description: 'Creation date' })
  createdAt: string;
}

export class ContractCallDTO {
  @ApiProperty({ description: 'Metadata' })
  metadata: any;

  @ApiProperty({ description: 'ID da blockchain' })
  blockchainId: string;
}

export class ContractSendDTO {
  @ApiProperty({ description: 'Customer tag' })
  customerTag: string;

  @ApiProperty({ description: 'Customer reference ID' })
  customerRefId: string;

  @ApiProperty({ description: 'Interaction description' })
  description: string;

  @ApiProperty({ description: 'Metadata' })
  metadata: any;

  @ApiProperty({ description: 'Source' })
  source: {
    assetId: string;
    walletId: string;
  };

  @ApiProperty({ description: 'Operation priority' })
  priority: string;
}