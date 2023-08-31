import { Test, TestingModule } from '@nestjs/testing';
import { RealDigitalTokenService } from './token.service';

describe('RealDigitalTokenService', () => {
  let service: RealDigitalTokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RealDigitalTokenService],
    }).compile();

    service = module.get<RealDigitalTokenService>(RealDigitalTokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
