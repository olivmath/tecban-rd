import { Module } from '@nestjs/common';
import { TPFtController } from './tpft.controller';
import { TPFtService } from './tpft.service';
import { ContractHelperService } from 'src/helpers/contract-helper/contract-helper.service';
import { ParfinModule } from 'src/parfin/parfin.module';
import { LoggerService } from 'src/logger/logger.service';
import { RealDigitalModule } from 'src/real-digital/real-digital.module';
import { UtilsModule } from 'src/utils/util.module';

@Module({
  imports: [ParfinModule, RealDigitalModule, UtilsModule],
  controllers: [TPFtController],
  providers: [TPFtService, ContractHelperService, LoggerService],
})
export class TPFtModule { }
