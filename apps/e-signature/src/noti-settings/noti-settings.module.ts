import { Module } from '@nestjs/common';
import { NotiSettingsService } from './noti-settings.service';
import { NotiSettingsController } from './noti-settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationSetting } from './entities/notification-setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([NotificationSetting])],
  controllers: [NotiSettingsController],
  providers: [NotiSettingsService],
})
export class NotiSettingsModule {}
