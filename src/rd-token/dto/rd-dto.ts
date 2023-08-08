import { ApiProperty } from '@nestjs/swagger';

export class ResponseDeployContractDto {
  @ApiProperty({ description: 'Contract Id' })
  contractId: string;

  @ApiProperty({ description: 'Transaction Hash' })
  transactionHash: string;  
}
export class DeployContractDto {
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

export class MintDto {
  @ApiProperty({ description: 'Endereço do destinatário' })
  to: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  amount: number;
}

export class TransferDto {
  @ApiProperty({ description: 'Endereço do destinatário' })
  to: string;

  @ApiProperty({ description: 'Quantidade a ser transferida' })
  amount: number;
}

export class BurnDto {
  @ApiProperty({ description: 'Quantidade a ser queimada' })
  amount: number;

  @ApiProperty({ description: 'Endereço da carteira' })
  from: string;  
}

export class ContractDto {
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
