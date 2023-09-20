import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';
import { PreRequest } from 'src/util/pre-request';

@Module({
  controllers: [TokenController],
  providers: [TokenService, TokenRepository, PreRequest],
})
export class RealDigitalTokenModule {}
