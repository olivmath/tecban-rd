import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KeyDictionaryService } from './key-dictionary.service';
import {
    KeyDictionaryAddAccountDTO,
    KeyDictionaryGetCustomerDataDTO,
    KeyDictionaryGetClientKeyDTO
} from 'src/dtos/key-dictionary.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('key-dictionary')
@ApiTags('KeyDictionary Operations')
export class KeyDictionaryController {
    constructor(private readonly keyDictionaryService: KeyDictionaryService) { }

    @Post('add-account')
    @ApiOperation({ summary: 'Key Dictionary add account', description: 'Add a customer account to the dictionary' })
    async addAccount(@Body() dto: KeyDictionaryAddAccountDTO) {
        return await this.keyDictionaryService.addAccount(dto);
    }

    @Get('get-client-key/:walletAddress')
    @ApiOperation({ summary: 'Key Dictionary get client key', description: 'Return a client key based on the wallet address' })
    async getClientKey(@Param() dto: KeyDictionaryGetClientKeyDTO) {
        return await this.keyDictionaryService.getClientKey(dto);
    }

    @Get('get-customer-data/:taxId')
    @ApiOperation({ summary: 'Get customer data', description: 'Return customer data using the tax ID (CPF)' })
    async getCustomerData(@Param() dto: KeyDictionaryGetCustomerDataDTO) {
        return await this.keyDictionaryService.getCustomerData(dto);
    }
}
