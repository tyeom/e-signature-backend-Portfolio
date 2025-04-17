import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { TeammateService } from './teammate.service';
import { User as UserDecorator } from '../users/decorator/user-decorator';
import { TokenPayload } from '../users/decorator/token-payload-decorator';
import { User } from '../users/entities/user.entity';
import { RBAC } from '@app/common/decorator';
import { Role } from '@app/common';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('teammate')
// class-transformer의 @Exclude()등 어노테이션 적용
@UseInterceptors(ClassSerializerInterceptor)
@ApiBearerAuth()
export class TeammateController {
  constructor(private readonly teammateService: TeammateService) {}

  @RBAC(Role.ADMIN)
  // @Public()
  @Get()
  getTeammate(@UserDecorator() user: User, @TokenPayload() tokenPayload: any) {
    console.log(user);
    console.log(tokenPayload);
    return 'adasd';
  }
}
