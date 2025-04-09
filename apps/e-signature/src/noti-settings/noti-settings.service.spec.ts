import { Test, TestingModule } from '@nestjs/testing';
import { NotiSettingsService } from './noti-settings.service';

describe('NotiSettingsService', () => {
  let service: NotiSettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotiSettingsService],
    }).compile();

    service = module.get<NotiSettingsService>(NotiSettingsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
