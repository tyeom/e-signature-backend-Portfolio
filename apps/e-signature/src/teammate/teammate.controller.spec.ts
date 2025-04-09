import { Test, TestingModule } from '@nestjs/testing';
import { TeammateController } from './teammate.controller';
import { TeammateService } from './teammate.service';

describe('TeammateController', () => {
  let controller: TeammateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TeammateController],
      providers: [TeammateService],
    }).compile();

    controller = module.get<TeammateController>(TeammateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
