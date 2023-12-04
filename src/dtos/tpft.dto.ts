import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, isNotEmpty } from "class-validator";
import { OperationEnum } from "src/types/tpft.types";




export class TPFtApproveTradeDTO {
  @ApiProperty({ description: 'Endereço da carteira do comprador' })
  @IsString()
  @IsNotEmpty()
  receiverWallet: string;
  @ApiProperty({ description: 'ID do asset da carteira do comprador na Parfin' })
  @IsString()
  @IsNotEmpty()
  receiverAssetId: string;
  @ApiProperty({ description: 'Valor da transação' })
  @IsString()
  @IsNotEmpty()
  total: string;
  @ApiProperty({ description: 'Valor formatado da transação para os métodos approve()' })
  @IsString()
  @IsNotEmpty()
  formattedTotal: string;
}
export class TPFtSetApprovalForAllDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Endereço da carteira que está criando a transação', })
  @IsString()
  @IsNotEmpty()
  walletAddress: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço do contrato que irá manipular TPFt' })
  @IsString()
  @IsNotEmpty()
  operator: string;

  @ApiProperty({ description: 'Aprovar ou não a manipulação de TPFt do operador' })
  @IsBoolean()
  @IsNotEmpty()
  approved: boolean;
}

export class TPFtGetBalanceOfQuery {
  @ApiProperty({ description: 'ID do TPFt (1, 2, 3, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftID: string;
}

export class TPFtGetBalanceOfDTO extends TPFtGetBalanceOfQuery {
  @ApiProperty({ description: 'Endereço da carteira' })
  @IsString()
  @IsNotEmpty()
  address: string;
}

export class TPFtAuctionPlacementDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID único da operação, criado pelo STN ou vendedor' })
  @IsString()
  @IsNotEmpty()
  operationId: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (o exemplo são 1.000 unidades com 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;
}

export class TPFtInstitutionBuyFromAnInstitutionDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID único da operação criado pelo vendedor' })
  @IsString()
  @IsNotEmpty()
  operationId: string;

  @ApiProperty({ description: 'CPNJ8 da instituição que está vendendo o TPFt' })
  @IsString()
  @IsNotEmpty()
  cnpj8Sender: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;
}

export class TPFtInstitutionSellToAnInstitutionDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'CPNJ8 da instituição que está vendendo o TPFt' })
  @IsString()
  @IsNotEmpty()
  cnpj8Receiver: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;
}

export class TPFtBuyParticipantAndItsClientDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'ID único da operação criado pelo vendedor' })
  @IsString()
  @IsNotEmpty()
  operationId: string;

  @ApiProperty({ description: 'Endereço da carteira do vendedor' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ description: 'Endereço da carteira do comprador' })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;
}

export class TPFtSellParticipantAndItsClientDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço da carteira do vendedor' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ description: 'Endereço da carteira do comprador' })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;
}

export class TPFtSellDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin, relacionado a carteira executando a operação' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço da carteira do vendedor' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ description: 'Endereço do contrato Real Tokenizado da IF relaciona ao vendedor' })
  @IsString()
  @IsNotEmpty()
  senderToken: string;

  @ApiProperty({ description: 'Endereço da carteira do comprador' })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ description: 'Endereço do contrato Real Tokenizado da IF relaciona ao comprador' })
  @IsString()
  @IsNotEmpty()
  receiverToken: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;

  @IsEnum(OperationEnum)
  @ApiProperty({
      description: 'Tipo de operação Compra ou Venda',
      examples: ['BUY', 'SELL'],
      required: true,
      enum: OperationEnum,
  })
  @IsNotEmpty()
  OperationType: OperationEnum;
}

export class TPFfBuyDTO extends TPFtSellDTO {
  @ApiProperty({ description: 'ID único da operação criado pelo vendedor' })
  @IsString()
  @IsNotEmpty()
  operationId: string;
}


export class TPFtTradeClientSameInstitutionDTO {
  @ApiProperty({
    description: 'Descrição da interação com o contrato na Parfin',
    default: '',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'ID que identifica o ativo na Parfin, relacionado a carteira executando a operação' })
  @IsString()
  @IsNotEmpty()
  assetId: string;

  @ApiProperty({ description: 'Endereço da carteira do vendedor' })
  @IsString()
  @IsNotEmpty()
  sender: string;

  @ApiProperty({ description: 'Endereço da carteira do comprador' })
  @IsString()
  @IsNotEmpty()
  receiver: string;

  @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
  @IsString()
  @IsNotEmpty()
  tpftSymbol: string;

  @ApiProperty({
    description:
      'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
    example: '100000'
  })
  @IsString()
  @IsNotEmpty()
  tpftAmount: string;

  @ApiProperty({ description: 'ID único da operação criado pelo vendedor' })
  @IsString()
  @IsOptional()
  operationId?: string;

  @ApiProperty({ description: 'Tipo da Operação: compra ou venda' })
  @IsString()
  @IsNotEmpty()
  operationType: string;

}


export class ClientToClientAnotherInstitutionDTO {
    @IsEnum(OperationEnum)
    @ApiProperty({
        description: 'Tipo de operação Compra ou Venda',
        examples: ['BUY', 'SELL'],
        required: true,
        enum: OperationEnum,
    })
    @IsNotEmpty()
    OperationType: OperationEnum;

    @ApiProperty({
        description: 'Descrição da interação com o contrato na Parfin',
        default: '',
        example: 'Descreva sua transação',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'ID que identifica o ativo na Parfin, relacionado a carteira executando a operação',
    })
    @IsString()
    @IsNotEmpty()
    assetId: string;

    @ApiProperty({ description: 'Endereço da carteira do cliente que está vendendo TPFt' })
    @IsString()
    @IsNotEmpty()
    sender: string;

    @ApiProperty({ description: 'Endereço do contrato Real Tokenizado da IF do cliente vendedor' })
    @IsString()
    @IsNotEmpty()
    senderToken: string;

    @ApiProperty({ description: 'Endereço da carteira do cliente que está comprando TPFt' })
    @IsString()
    @IsNotEmpty()
    receiver: string;

    @ApiProperty({ description: 'Endereço do contrato Real Tokenizado da IF do cliente comprador' })
    @IsString()
    @IsNotEmpty()
    receiverToken: string;

    @ApiProperty({ description: 'Símbolo do TPFt da transação (LTN, LFT, etc.)' })
    @IsString()
    @IsNotEmpty()
    tpftSymbol: string;

    @ApiProperty({
        description: 'Quantidade de TPFt da operação (incluir 2 casas decimais no final do número inteiro)',
        example: '100000',
    })
    @IsString()
    @IsNotEmpty()
    tpftAmount: string;

    @ApiProperty({ description: 'ID único da operação criado pelo vendedor, apenas se vc estiver comprando' })
    @IsString()
    @IsOptional()
    operationId?: string;
}
