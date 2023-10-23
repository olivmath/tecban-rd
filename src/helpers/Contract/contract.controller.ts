import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ContractName, ContractHelperService } from './contract.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('contract')
@ApiTags('Contract Helper')
export class ContractHelperController {
    constructor(private readonly contractService: ContractHelperService) { }

    @Get('get-contract-address-by-name/:name')
    async getContractAddressByName(@Param('name') name: ContractName) {
        try {
            const address = await this.contractService.getContractAddress(name);
            return { address };
        } catch (error) {
            throw new NotFoundException(
                `Contract with name ${name} not found.`,
            );
        }
    }
}
