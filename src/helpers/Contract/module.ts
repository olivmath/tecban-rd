import { ParfinService } from 'src/parfin/parfin.service';
import { Module } from '@nestjs/common';
import { PreRequest } from '../pre-request';

@Module({
    controllers: [],
    providers: [ParfinService, PreRequest],
    exports: [],
})
export class ContractHelperModule { }
