import { ApiProperty } from '@nestjs/swagger';

export class ContractHelperGetContractSuccessRes {
    @ApiProperty({
        description: 'Endereço do contrato',
        type: String,
    })
    address: string;
}

export class EncodedDataResponse {
    @ApiProperty({
        description: 'Hexdecimal dos dados codificados',
        type: [String],
    })
    data: string[];
}

export class DecodedDataResponse {
    @ApiProperty({
        description: 'Dados decodificados',
        type: [String],
    })
    data: string[];
}

export class DecodedKeyDictionaryGetCustomerResponse {
    @ApiProperty({ description: 'CPF do cliente' })
    taxId: string;
    @ApiProperty({ description: 'Código do banco do cliente' })
    bankNumber: string;
    @ApiProperty({ description: 'Número da conta do cliente' })
    account: string;
    @ApiProperty({ description: 'Número da agência do banco cliente' })
    branch: string;
    @ApiProperty({ description: 'Endereço da carteira do cliente' })
    wallet: string;
    @ApiProperty({ description: 'Diz se o cliente está registrado' })
    registered: boolean;
    @ApiProperty({ description: 'Endereço da carteira da insituição responsável pelo cliente' })
    owner: string;
}

export class DecodedKeyDictionaryGetKeyResponse {
    @ApiProperty({ description: 'Chave do cliente (hash do CPF)' })
    clientKey: string;
}