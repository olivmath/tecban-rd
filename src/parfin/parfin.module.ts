import { Module } from '@nestjs/common';
import { ParfinController } from './parfin.controller';
import { ParfinService } from './parfin.service';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinAuth } from 'src/auth/parfin.auth';

@Module({
    controllers: [ParfinController],
    providers: [ParfinService, ParfinAuth, LoggerService],
    exports: [ParfinService],
})
export class ParfinModule { }
