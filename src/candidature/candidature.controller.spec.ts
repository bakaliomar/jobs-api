import { Test, TestingModule } from '@nestjs/testing';
import { CandidatureController } from './candidature.controller';

describe('CandidatureController', () => {
  let controller: CandidatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CandidatureController],
    }).compile();

    controller = module.get<CandidatureController>(CandidatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
