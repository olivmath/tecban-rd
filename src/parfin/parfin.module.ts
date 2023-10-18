import { Module } from '@nestjs/common';
import { ParfinController } from './parfin.controller';
import { ParfinService } from './parfin.service';
import { PreRequest } from 'src/helpers/pre-request';
import { LoggerService } from 'src/logger/logger.service';

@Module({
    controllers: [ParfinController],
    providers: [ParfinService, PreRequest, LoggerService],
    exports: [ParfinService],
})
export class ParfinModule {}
