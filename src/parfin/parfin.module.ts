import { Module } from '@nestjs/common';
import { ParfinController } from './parfin.controller';
import { ParfinService } from './parfin.service';
import { LoggerService } from 'src/logger/logger.service';
import { ParfinHttpService } from './parfin.api.service';

@Module({
    controllers: [ParfinController],
    providers: [ParfinService, LoggerService, ParfinHttpService],
    exports: [ParfinService],
})
export class ParfinModule {}
