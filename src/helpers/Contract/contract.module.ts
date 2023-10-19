import { ParfinService } from 'src/parfin/parfin.service';
import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';

@Module({
    controllers: [],
    providers: [ParfinService],
    exports: [ContractService],
})
export class ContractHelperModule { }
