import { Module } from '@nestjs/common';
import { RealDigitalTokenController } from './rd-token.controller';
import { RealDigitalTokenService } from './rd-token.service';
import { RealDigitalTokenRepository } from './rd-token.repository';

@Module({
  controllers: [RealDigitalTokenController],
  providers: [RealDigitalTokenService, RealDigitalTokenRepository],
})
export class RealDigitalTokenModule {}
