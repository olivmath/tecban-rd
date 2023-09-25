import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class DeployContractDTO {
  @ApiProperty({ description: 'Customer tag' })
  @IsString()
  @IsOptional()
  customerTag?: string;

  @ApiProperty({ description: 'Customer reference ID' })
  @IsString()
  @IsOptional()
  customerRefId: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsOptional()
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

export class ResponseDeployContractDTO {
  @ApiProperty({ description: 'Contract Id' })
  contractId: string;

  @ApiProperty({ description: 'Transaction Hash' })
  transactionHash: string;
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
