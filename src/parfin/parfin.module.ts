import { Module } from '@nestjs/common';
import { ParfinController } from './parfin.controller';
import { ParfinService } from './parfin.service';
import { PreRequest } from 'src/helpers/pre-request';

@Module({
  controllers: [ParfinController],
  providers: [ParfinService, PreRequest],
  exports: [ParfinService],
})
export class ParfinModule {}
