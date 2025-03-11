import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';
import { ROLE_TYPE_KEY } from 'src/auth/constants/role.constants';
import { RoleType } from 'src/auth/enums/role-type.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  private static readonly defaultAuthType = RoleType.Admin;

  constructor(
    /**
     * Injecting Reflector
     */
    private readonly reflector: Reflector,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride(ROLE_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [RoleGuard.defaultAuthType];

    const request = context.switchToHttp().getRequest();

    const user = request[REQUEST_USER_KEY];

    // Check if user has any of the required roles
    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException('You cannot perform this action');
    }
    return true;
  }
}
