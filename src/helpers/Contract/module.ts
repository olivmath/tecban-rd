import { ParfinService } from 'src/parfin/parfin.service';
import { Module } from '@nestjs/common';

@Module({
    controllers: [],
    providers: [ParfinService],
    exports: [],
})
export class ContractHelperModule {}
