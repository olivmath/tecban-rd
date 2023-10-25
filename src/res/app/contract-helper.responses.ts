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
