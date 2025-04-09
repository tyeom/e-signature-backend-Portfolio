import { Test, TestingModule } from '@nestjs/testing';
import { SignProcController } from './sign-proc.controller';

describe('SignProcController', () => {
  let controller: SignProcController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SignProcController],
    }).compile();

    controller = module.get<SignProcController>(SignProcController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
