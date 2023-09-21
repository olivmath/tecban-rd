import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { PreRequest } from 'src/helpers/pre-request';
import { ParfinService } from 'src/parfin/parfin.service';
import { ContractHelper } from 'src/helpers/contract';

@Module({
  controllers: [TokenController],
  providers: [
    TokenService,
    TokenRepository,
    PreRequest,
    TokenRepository,
    ParfinService,
    ContractHelper,
  ],
})
export class RealDigitalTokenModule {}
