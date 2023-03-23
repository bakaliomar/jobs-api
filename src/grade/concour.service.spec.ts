import { Test, TestingModule } from '@nestjs/testing';
import { ConcourService } from './concour.service';

describe('ConcourService', () => {
  let service: ConcourService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ConcourService],
    }).compile();

    service = module.get<ConcourService>(ConcourService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
