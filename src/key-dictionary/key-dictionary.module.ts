import { Module } from '@nestjs/common';
import { ContractHelperModule } from 'src/helpers/contract-helper/contract-helper.module';
import { LoggerModule } from 'src/logger/logger.module';
import { ParfinModule } from 'src/parfin/parfin.module';
import { KeyDictionaryService } from './key-dictionary.service';
import { KeyDictionaryController } from './key-dictionary.controller';

@Module({
    controllers: [KeyDictionaryController],
    imports: [ParfinModule, ContractHelperModule, LoggerModule],
    providers: [KeyDictionaryService],
    exports: [KeyDictionaryService],
})
export class KeyDictionaryModule {}
