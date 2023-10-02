import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class ParfinDeployContractDTO {
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

export class ParfinDeployContractResDTO {
  @ApiProperty({ description: 'Contract Id' })
  contractId: string;

  @ApiProperty({ description: 'Transaction Hash' })
  transactionHash: string;
}

export class ParfinRegisterContractDTO {
  @ApiProperty({ description: 'Contract Address' })
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty({ description: 'Blockchain ID' })
  @IsString()
  @IsNotEmpty()
  blockchainId: string;
}

export class ParfinRegisterContractResDTO {
  @ApiProperty({ description: 'Contract Id' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Blockchain ID' })
  @IsString()
  @IsNotEmpty()
  blockchainId: string;

  @ApiProperty({ description: 'Contract Address' })
  @IsString()
  @IsNotEmpty()
  contractAddress: string;

  @ApiProperty({ description: 'Contract Register date' })
  @IsString()
  @IsNotEmpty()
  createdAt: Date;
}

export class ParfinContractDTO {
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

export class ParfinContractCallDTO {
  @ApiProperty({ description: 'Metadata' })
  metadata: any;

  @ApiProperty({ description: 'ID da blockchain' })
  blockchainId: string;
}

export class ParfinContractCallResDTO {
  @ApiProperty({ description: 'Retorno da consulta ao contrato' })
  data: Object;
}

export class ParfinContractSendDTO {
  @ApiProperty({ description: 'Customer tag' })
  customerTag: string;

  @ApiProperty({ description: 'Customer reference ID' })
  customerRefId: string;

  @ApiProperty({ description: 'Source' })
  source: {
    assetId: string;
  };

  @ApiProperty({ description: 'Metadata' })
  metadata: any;

  @ApiProperty({ description: 'Operation priority' })
  priority: string;
}

export class ParfinContractSendResDTO {
  @ApiProperty({
    description: 'ID da transação que foi assinada e inserida na blockchain',
  })
  id: string;
}
