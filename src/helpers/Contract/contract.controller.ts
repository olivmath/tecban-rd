import { ContractName, ContractHelperService } from './contract.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { DecodeDataDTO, EncodeDataDTO } from './contract.dto';
import { LoggerService } from 'src/logger/logger.service';
import {
    BadRequestException,
    NotFoundException,
    Controller,
    Param,
    Body,
    Post,
    Get,
} from '@nestjs/common';
import {
    DecodedDataResponse,
    EncodedDataResponse,
} from 'src/res/app/contract.responses';

@Controller('contract')
@ApiTags('Contract Helper')
export class ContractHelperController {
    constructor(
        private readonly contractService: ContractHelperService,
        private readonly logger: LoggerService,
    ) {
        this.logger.setContext('ContractHelperController');
    }

    @Get('get-contract-address-by-name/:name')
    async getContractAddressByName(@Param('name') name: ContractName) {
        if (!this.contractService.isContractNameValid(name)) {
            throw new BadRequestException('Invalid contract name.');
        }
        try {
            const address = await this.contractService.getContractAddress(name);
            return { address };
        } catch (error) {
            this.logger.error(error);
            throw new NotFoundException(
                `Contract with name ${name} not found.`,
            );
        }
    }

    @Post('encode-data')
    @ApiOperation({
        summary: 'Encode function call to smartcontract',
        description: 'Encode function call to smartcontract for send to Parfin',
    })
    @ApiResponse({
        status: 200,
        description: 'Encoded data',
        type: EncodedDataResponse,
    })
    @ApiResponse({ status: 400, description: 'Bad Request' })
    async encodeData(
        @Body() body: EncodeDataDTO,
    ): Promise<EncodedDataResponse | BadRequestException> {
        try {
            if (!this.contractService.isContractNameValid(body.contractName)) {
                throw new BadRequestException('Invalid contract name.');
            }

            const contract = this.contractService.getContractMethods(
                body.contractName,
            );
            const encodedData = contract[body.functionName](...body.args);

            return { data: encodedData };
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException('An error occurred');
        }
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
    async decodeData(
        @Body() body: DecodeDataDTO,
    ): Promise<DecodedDataResponse | BadRequestException> {
        try {
            if (!this.contractService.isContractNameValid(body.contractName)) {
                throw new BadRequestException('Invalid contract name.');
            }

            const contract = this.contractService.getContractMethods(
                body.contractName,
            );
            const decodedData = contract[body.functionName]({
                returned: body.data,
            });

            return { data: decodedData };
        } catch (error) {
            this.logger.error(error);
            throw new BadRequestException('An error occurred');
        }
    }
}
