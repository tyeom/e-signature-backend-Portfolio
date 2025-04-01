import { Test, TestingModule } from '@nestjs/testing';
import { NotiSettingsController } from './noti-settings.controller';
import { NotiSettingsService } from './noti-settings.service';

describe('NotiSettingsController', () => {
  let controller: NotiSettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotiSettingsController],
      providers: [NotiSettingsService],
    }).compile();

    controller = module.get<NotiSettingsController>(NotiSettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
