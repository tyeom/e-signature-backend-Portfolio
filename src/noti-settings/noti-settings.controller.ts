import { Body, Controller, Get, Put } from '@nestjs/common';
import { NotiSettingsService } from './noti-settings.service';
import { Role } from 'src/common/enums/role-enum';
import { User as UserDecorator } from 'src/users/decorator/user-decorator';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { User } from 'src/users/entities/user.entity';
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
