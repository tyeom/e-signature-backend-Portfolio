import { Body, Controller, Get, Put } from '@nestjs/common';
import { NotiSettingsService } from './noti-settings.service';
import { Role } from '@app/common';
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { RBAC } from '@app/common/decorator';
import { User } from '../users/entities/user.entity';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('settings')
@ApiBearerAuth()
export class NotiSettingsController {
  constructor(private readonly notiSettingsService: NotiSettingsService) {}
  @Put('notification')
  @RBAC(Role.USER)
  @ApiResponse({
    status: 200,
    description: 'notification 설정 완료, 설정된 notification 정보 응답',
  })
  updateNotiSetting(
    @Body() body: UpdateSettingDto,
    @UserDecorator() user: User,
  ) {
    return this.notiSettingsService.updateNotiSetting(body, user);
  }

  @Get('notification')
  @RBAC(Role.USER)
  @ApiResponse({
    status: 200,
    description: '설정된 notification 정보 응답',
  })
  findByUserId(@UserDecorator() user: User) {
    return this.notiSettingsService.findByUserId(user);
  }
}
