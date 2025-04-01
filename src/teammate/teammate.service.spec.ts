import { Test, TestingModule } from '@nestjs/testing';
import { TeammateService } from './teammate.service';

describe('TeammateService', () => {
  let service: TeammateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TeammateService],
    }).compile();

    service = module.get<TeammateService>(TeammateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
