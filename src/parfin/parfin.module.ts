import { Module } from '@nestjs/common';
import { ParfinController } from './parfin.controller';
import { ParfinService } from './parfin.service';
import { PreRequest } from 'src/helpers/pre-request';
import { ParfinRepository } from './parfin.repository';

@Module({
  controllers: [ParfinController],
  providers: [
    ParfinService,
    ParfinRepository,
    PreRequest],
  exports: [ParfinService],
})
export class ParfinModule { }
