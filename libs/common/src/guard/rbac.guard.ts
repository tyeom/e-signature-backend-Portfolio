import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@app/common';
import { RBAC } from '../decorator/rbac.decorator';

@Injectable()
export class RBACGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const role = this.reflector.get<Role>(RBAC, context.getHandler());

    if (!Object.values(Role).includes(role)) {
      return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const request = context.switchToHttp().getRequest();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (!request.user) {
      return false;
    }

    // 어차피 관리자 권한이 있으면 모든 권한이 있음. (isSiteAdmin === true)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (request.user.isSiteAdmin) {
      return true;
    }
    // 일반 유저
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    else if (role === Role.USER && request.user.isSiteAdmin === false) {
      return true;
    }

    // if (role === Role.ADMIN && request.user.isSiteAdmin) {
    // return true;
    // }

    return false;
  }
}
