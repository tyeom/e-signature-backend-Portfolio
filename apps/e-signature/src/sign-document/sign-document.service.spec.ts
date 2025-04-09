import { Test, TestingModule } from '@nestjs/testing';
import { SignDocumentService } from './sign-document.service';

describe('SignDocumentService', () => {
  let service: SignDocumentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SignDocumentService],
    }).compile();

    service = module.get<SignDocumentService>(SignDocumentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
