import { Test, TestingModule } from '@nestjs/testing';
import { SignDocumentController } from './sign-document.controller';
import { SignDocumentService } from './sign-document.service';

describe('SignDocumentController', () => {
  let controller: SignDocumentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignDocumentController],
      providers: [SignDocumentService],
    }).compile();

    controller = module.get<SignDocumentController>(SignDocumentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
