import { Module } from '@nestjs/common';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import { TokenRepository } from './token.repository';

@Module({
  controllers: [TokenController],
  providers: [TokenService, TokenRepository],
})
export class RealDigitalTokenModule { }
