import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { KeyDictionaryService } from './key-dictionary.service';
import {
    KeyDictionaryAddAccountDTO,
    KeyDictionaryGetCustomerDataDTO,
    KeyDictionaryGetCustomerKeyDTO,
    KeyDictionaryGetCustomerWalletDTO,
} from 'src/dtos/key-dictionary.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('key-dictionary')
@ApiTags('KeyDictionary Operations')
export class KeyDictionaryController {
    constructor(private readonly keyDictionaryService: KeyDictionaryService) {}

    @Post('add-account')
    @ApiOperation({ summary: 'Key Dictionary add account', description: 'Add a customer account to the dictionary' })
    async addAccount(@Body() dto: KeyDictionaryAddAccountDTO) {
        return await this.keyDictionaryService.addAccount(dto);
    }

    @Get('get-customer-key/:walletAddress')
    @ApiOperation({
        summary: 'Key Dictionary get client key',
        description: 'Return a client key based on the wallet address',
    })
    async getClientKey(@Param() dto: KeyDictionaryGetCustomerKeyDTO) {
        return await this.keyDictionaryService.getCustomerKey(dto);
    }

    @Get('get-customer-data/:taxId')
    @ApiOperation({ summary: 'Get customer data', description: 'Return customer data using the tax ID (CPF)' })
    async getCustomerData(@Param() dto: KeyDictionaryGetCustomerDataDTO) {
        return await this.keyDictionaryService.getCustomerData(dto);
    }

    @Get('get-customer-wallet/:key')
    @ApiOperation({ summary: 'Get customer wallet', description: 'Return customer wallet' })
    async getCustomerWallet(@Param() dto: KeyDictionaryGetCustomerWalletDTO) {
        return await this.keyDictionaryService.getCustomerWallet(dto);
    }
}
