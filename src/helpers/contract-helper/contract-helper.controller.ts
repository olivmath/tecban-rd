import { ContractHelperService } from './contract-helper.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DecodeDataDTO, EncodeDataDTO } from '../../dtos/contract-helper.dto';
import { LoggerService } from 'src/logger/logger.service';
import { BadRequestException, NotFoundException, Controller, Param, Body, Post, Get } from '@nestjs/common';
import { DecodedDataResponse, EncodedDataResponse } from 'src/res/app/contract-helper.responses';
import { encodeData200, getContractAddress200 } from 'src/res/swagger/contract-helper.swagger';
import { appError400 } from 'src/res/swagger/error.swagger';
import { ContractName } from 'src/types/contract-helper.types';

@Controller('contract-helper')
@ApiTags('Contract Helper')
export class ContractHelperController {
    constructor(private readonly contractService: ContractHelperService, private readonly logger: LoggerService) {
        this.logger.setContext('ContractHelperController');
    }

    @Get('get-contract-address-by-name/:contractName')
    @ApiOperation({
        summary: 'Get a contract address',
        description: 'Get a contract address using the contract name',
    })
    @getContractAddress200
    async getContractAddressByName(@Param('contractName') contractName: string) {
        this.logger.setContext('ContractHelperController::getContractAddressByName');

        const address = await this.contractService.getContractAddress(contractName as ContractName);
        return { address };
    }

    @Post('encode-data')
    @encodeData200
    @appError400
    @ApiOperation({
        summary: 'Encode function call to smartcontract',
        description: 'Encode function call to smartcontract for send to Parfin',
    })
    async encodeData(@Body() body: EncodeDataDTO): Promise<EncodedDataResponse | BadRequestException> {
        this.logger.setContext('ContractHelperController::encodeData');

        const contract = this.contractService.getContractMethods(body.contractName);
        const encodedData = contract[body.functionName](...body.args);

        return { data: encodedData };
    }

    @Post('decode-data')
    @ApiOperation({
        summary: 'Decode data returned from smartcontract',
        description: 'Decode data returned from smartcontract via Parfin',
    })
    @ApiResponse({
        status: 200,
        description: 'Decoded data',
        type: DecodedDataResponse,
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async decodeData(@Body() body: DecodeDataDTO): Promise<DecodedDataResponse | BadRequestException> {
        this.logger.setContext('ContractHelperController::decodeData');

        const contract = this.contractService.getContractMethods(body.contractName);
        const decodedData = contract[body.functionName](body.data);

        return { data: decodedData };
    }
}
