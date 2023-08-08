import { Test, TestingModule } from '@nestjs/testing';
import { RealDigitalTokenController } from './rd-token.controller';

describe('RealDigitalTokenController', () => {
  let controller: RealDigitalTokenController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RealDigitalTokenController],
    }).compile();

    controller = module.get<RealDigitalTokenController>(
      RealDigitalTokenController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
