import { Test, TestingModule } from '@nestjs/testing';
import { ConcourController } from './concour.controller';

describe('ConcourController', () => {
  let controller: ConcourController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConcourController],
    }).compile();

    controller = module.get<ConcourController>(ConcourController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
