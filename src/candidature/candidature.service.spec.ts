import { Test, TestingModule } from '@nestjs/testing';
import { CandidatureService } from './candidature.service';

describe('CandidatureService', () => {
  let service: CandidatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CandidatureService],
    }).compile();

    service = module.get<CandidatureService>(CandidatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
