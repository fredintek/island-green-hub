import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { AccessTokenGuard } from '../access-token/access-token.guard';
import { AUTH_TYPE_KEY } from 'src/auth/constants/auth.constants';
import { RoleGuard } from '../role/role.guard';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  private static readonly defaultAuthType = AuthType.Bearer;

  private readonly authTypeGuardMap: Record<
    AuthType,
    CanActivate | CanActivate[]
  > = {
    [AuthType.None]: { canActivate: () => true },
    [AuthType.Bearer]: this.accessTokenGuard,
  };

  constructor(
    /**
     * Injecting Nest JS Reflector
     */
    private reflector: Reflector,

    /**
     * Injecting AccessToken Guard
     */
    private accessTokenGuard: AccessTokenGuard,

    /**
     * Injecting RoleGuard
     */
    private roleGuard: RoleGuard,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get auth types from the metadata using the reflector

    const authTypes = this.reflector.getAllAndOverride(AUTH_TYPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]) || [AuthenticationGuard.defaultAuthType];

    // If AuthType.None is present, allow access without authentication or role checks
    if (authTypes.includes(AuthType.None)) {
      return true;
    }

    // Proceed with authentication using the defined guards
    for (const authType of authTypes) {
      const guard = this.authTypeGuardMap[authType];

      if (!guard) continue; // If an invalid auth type is encountered, skip

      try {
        if (await guard.canActivate(context)) {
          return this.roleGuard.canActivate(context);
        }
      } catch (error) {
        throw new UnauthorizedException();
      }
    }

    throw new UnauthorizedException();
  }
}
