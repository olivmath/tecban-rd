import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WalletAsset } from '../../types/wallet.types';

export class WalletSuccessRes {
  @ApiProperty({
    description: 'ID da operação de criação',
    type: String,
  })
  id: string;

  @ApiProperty({
    description: 'Rede da blockchain associada a carteira',
    type: String,
  })
  blockchainNetwork: string;

  @ApiProperty({
    description: 'Nome da blockchain associada a carteira',
    type: String,
  })
  blockchainName: string;

  @ApiProperty({
    description: 'ID da blockchain associada a carteira',
    type: String,
  })
  blockchainId: string;

  @ApiProperty({
    description: 'ID da carteira',
    type: String,
  })
  walletId: string;

  @ApiProperty({
    description: 'Endereço da carteira',
    type: String,
  })
  address: string;

  @ApiProperty({
    description: 'Nome da carteira',
    type: String,
  })
  name: string;

  @ApiProperty({
    description: 'Ativos da carteira',
    type: [WalletAsset],
  })
  assets: WalletAsset[];

  @ApiProperty({
    description: 'Diz se a carteira está habilitada para uso',
    type: Boolean,
  })
  enabled: boolean;

  @ApiProperty({
    description: 'Diz se a carteira está bloqueada',
    type: Boolean,
  })
  isBlocked: boolean;

  @ApiProperty({
    description: 'Histórico de metadata da carteira',
    type: [String],
  })
  blockedMetadataHistory: string[];

  @ApiProperty({
    description: 'Tipo de carteira',
    type: String,
  })
  walletType: string;

  @ApiPropertyOptional({
    description: 'ID da empresa',
    type: String,
  })
  companyId?: string;

  @ApiPropertyOptional({
    description: 'ID do usuário',
    type: String,
  })
  userId?: string;
}

export class CreateClientWalletRes {
  @ApiProperty({
    description: 'address da carteira do client',
    type: String,
  })
  wallet: string

  @ApiProperty({
    description: 'id da carteira do cliente na parfin',
    type: String,
  })
  walletId: string

  @ApiProperty({
    description: 'key da carteira do cliente no KeyDictionary e no MongoDB',
    type: String,
  })
  clientKey: string
}
export class WalletAddNewAssetSuccessRes {
  @ApiProperty({ description: 'ID do asset adicionado na carteira' })
  assetId: string;
}
