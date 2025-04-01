import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/enums/role-enum';

export const RBAC = Reflector.createDecorator<Role>();
