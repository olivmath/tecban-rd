import { ParfinService } from 'src/parfin/parfin.service';
import { Module } from '@nestjs/common';
import { PreRequest } from '../pre-request';
import { ContractService } from './contract.service';

@Module({
    controllers: [],
    providers: [ParfinService, PreRequest],
    exports: [ContractService],
})
export class ContractHelperModule {}
