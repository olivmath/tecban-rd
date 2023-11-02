import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OwnerType, WalletAsset } from '../../types/wallet.types';

export class WalletCreateSuccessRes {
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

  @ApiProperty({
    description: 'ID do dono da cartiera',
    type: String,
  })
  ownerId: string;

  @ApiProperty({
    description: 'Tipo de dono da carteira (instituição financeira ou um cliente)',
    type: String,
  })
  ownerType: string;
}

export class WalletCreateClientSuccessRes extends WalletCreateSuccessRes {
  @ApiProperty({
    description: 'Key da carteira do cliente registrada no KeyDictionary',
    type: String,
  })
  clientKey: string;
}
export class WalletAddNewAssetSuccessRes {
  @ApiProperty({ description: 'ID do asset adicionado na carteira' })
  assetId: string;
}
