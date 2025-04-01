import { Controller, Get } from '@nestjs/common';
import { TeammateService } from './teammate.service';
import { Public } from 'src/authentication/decorator/public.decorator';
import { User as UserDecorator } from 'src/users/decorator/user-decorator';
import { TokenPayload } from 'src/users/decorator/token-payload-decorator';
import { User } from 'src/users/entities/user.entity';
import { RBAC } from 'src/authentication/decorator/rbac.decorator';
import { Role } from 'src/common/enums/role-enum';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('teammate')
@ApiBearerAuth()
export class TeammateController {
  constructor(private readonly teammateService: TeammateService) {}

  @RBAC(Role.ADMIN)
  // @Public()
  @Get()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  getTeammate(@UserDecorator() user: User, @TokenPayload() tokenPayload: any) {
    console.log(user);
    console.log(tokenPayload);
    return 'adasd';
  }
}
