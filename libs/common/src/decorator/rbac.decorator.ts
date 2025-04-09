import { Reflector } from '@nestjs/core';
import { Role } from '@app/common';

export const RBAC = Reflector.createDecorator<Role>();
