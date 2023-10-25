import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsString } from "class-validator";
import { ContractName } from "src/helpers/contract-helper/contract-helper.service";

export class ContractHelperGetContractDTO {
  @ApiProperty({ description: 'Nome do contrato' })
  @IsString()
  @IsNotEmpty()
  contractName: string;
}

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
    example: 'STR',
  })
  @IsString()
  contractName: ContractName;

  @ApiProperty({
    description: 'Nome da função que vai ser chamada no `contractName`',
    example: 'requestToMint',
  })
  @IsString()
  functionName: string;

  @ApiProperty({
    description:
      'Lista de argumentos que vai ser passado como parametro para a `functionName`',
    example: ['100', { key: 'param1', value: 'value1' }],
  })
  @IsArray()
  args: any[];
}