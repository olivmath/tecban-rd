import { Body, Controller, Get, Post } from '@nestjs/common';
import { KeyDictionaryService } from './key-dictionary.service';
import { KeyDictionaryAddAccountDTO, KeyDictionaryGetCustomerDataDTO } from 'src/dtos/key-dictionary.dto';
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

    @Get('get-customer-data')
    @ApiOperation({ summary: 'Get customer data', description: 'Return customer data' })
    async getCustomerData(@Body() dto: KeyDictionaryGetCustomerDataDTO) {
        return await this.keyDictionaryService.getCustomerData(dto);
    }
}
