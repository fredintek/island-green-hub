import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { REQUEST_USER_KEY } from 'src/auth/constants/auth.constants';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    /**
     * Inject JwtService
     */
    private readonly jwtService: JwtService,

    /**
     * Inject GlobalConfiguration
     */
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Extract the request from the execution context
    const request = context.switchToHttp().getRequest();

    // Extract the access token from the request
    const accessToken = this.extractTokenFromHeader(request);

    // Check if the access token exists
    if (!accessToken) {
      throw new UnauthorizedException();
    }

    // Verify the access token
    try {
      const payload = await this.jwtService.verifyAsync(accessToken, {
        audience: this.configService.get('jwt.audience'),
        issuer: this.configService.get('jwt.issuer'),
        secret: this.configService.get('jwt.secret'),
        maxAge: this.configService.get('jwt.expiresIn'),
      });

      // Add the user id to the request context
      request[REQUEST_USER_KEY] = payload;
    } catch (error) {
      throw new UnauthorizedException('Invalid access token');
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | null {
    // Get the authorization header from the request
    const authorizationHeader = request.headers.authorization;

    // Check if the authorization header exists
    if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
      return null;
    }

    // Split the authorization header into 'Bearer' and the access token
    const token = authorizationHeader.split(' ')[1]?.trim();
    return token || null;
  }
}
