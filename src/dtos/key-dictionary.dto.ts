import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Length, MaxLength, MinLength } from 'class-validator';

export class KeyDictionaryAddAccountDTO {
    @ApiProperty({
        description: 'Descrição da interação com o contrato',
        default: '',
        required: false,
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'CPF do cliente', example: '12345678901' })
    @IsString()
    @IsNotEmpty()
    @Length(11, 11, { message: 'Invalid CPF length' })
    taxId: string;

    @ApiProperty({ description: 'Código do banco do cliente', example: '123' })
    @IsString()
    @IsNotEmpty()
    bankNumber: string;

    @ApiProperty({ description: 'Conta do banco do cliente', example: '987654' })
    @IsString()
    @IsNotEmpty()
    account: string;

    @ApiProperty({ description: 'Agência do banco do cliente', example: '4567' })
    @IsString()
    @IsNotEmpty()
    branch: string;

    @ApiProperty({ description: 'Endereço da carteira' })
    @IsString()
    @IsNotEmpty()
    walletAddress: string;
}

export class KeyDictionaryGetCustomerDataDTO {
    @ApiProperty({ description: 'CPF do cliente', example: '12345678901' })
    @IsString()
    @IsNotEmpty()
    @MinLength(11, { message: 'Invalid CPF length' })
    @MaxLength(11, { message: 'Invalid CPF length' })
    taxId: string;
}
