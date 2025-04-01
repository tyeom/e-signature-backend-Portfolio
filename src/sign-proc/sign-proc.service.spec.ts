import { Test, TestingModule } from '@nestjs/testing';
import { SignProcService } from './sign-proc.service';

describe('SignProcService', () => {
  let service: SignProcService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignProcService],
    }).compile();

    service = module.get<SignProcService>(SignProcService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
