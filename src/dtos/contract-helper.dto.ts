import { ContractName } from 'src/types/contract-helper.types';
import { IsArray, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DecodeDataDTO {
    @ApiProperty({
        description: 'Nome do contrato que',
        example: 'AddressDiscovery',
    })
    @IsString()
    contractName: ContractName;

    @ApiProperty({
        description: 'Nome da função que retornou dados do `contractName`',
        example: 'addressDiscovery',
    })
    @IsString()
    functionName: string;

    @ApiProperty({
        description: 'Hexadecimal do retorno da `functionName`',
        example:
            '0x000000000000000000000000742d35Cc6634C0532925a3b844Bc454e4438f44e',
    })
    @IsString()
    data: string;
}

export class EncodeDataDTO {
    @ApiProperty({
        description: 'Nome do contrato que',
        example: 'ITPFtOperation1052',
    })
    @IsString()
    contractName: ContractName;

    @ApiProperty({
        description: 'Nome da função que vai ser chamada no `contractName`',
        example:
            'trade(uint256,address,address,address,address,uint8,tuple,uint256,uint256)',
    })
    @IsString()
    functionName: string;

    @ApiProperty({
        description:
            'Lista de argumentos que vai ser passado como parametro para a `functionName`',
        example: [
            '123321',
            '0x00A82e6cB71AF785C65Bae54925326bC85b3068d',
            '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
            '0x06652404DE35F3BE183132e526d8b9be0f7db404',
            '0xe0959D39d357deBd6b5Cb143B30d04078C364C46',
            '0',
            {
                acronym: 'ABC',
                code: 'XYZ',
                maturityDate: '1671648000',
            },
            '10000',
            '500',
        ],
    })
    @IsArray()
    args: any[];
}
