import { Module } from '@nestjs/common';
import { RealDigitalTokenModule } from './rd-token/rd-token.module';
import { ConfigModule } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { HealthController } from './health.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    TerminusModule,
    RealDigitalTokenModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
