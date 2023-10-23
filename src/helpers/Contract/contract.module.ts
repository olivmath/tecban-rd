import { Module } from '@nestjs/common';
import { ContractHelperController } from './contract.controller';
import { ContractHelperService } from './contract.service';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerModule } from 'src/logger/logger.module';

@Module({
    imports: [ParfinModule, LoggerModule],
    controllers: [ContractHelperController],
    providers: [ContractHelperService],
    exports: [ContractHelperService],
})
export class ContractHelperModule { }
