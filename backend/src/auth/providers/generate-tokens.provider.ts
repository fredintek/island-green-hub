import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/user.entity';
import { ActiveUserInterface } from '../interfaces/active-user.interface';

@Injectable()
export class GenerateTokensProvider {
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

  public async signToken<T>(userId: number, expiresIn: string, payload?: T) {
    return await this.jwtService.signAsync(
      { sub: userId, ...payload },
      {
        expiresIn,
        issuer: this.configService.get('jwt.issuer'),
        audience: this.configService.get('jwt.audience'),
        secret: this.configService.get('jwt.secret'),
      },
    );
  }

  public async generateTokens(user: User) {
    const accessToken = await this.signToken<Partial<ActiveUserInterface>>(
      user.id,
      this.configService.get('jwt.expiresIn') as string,
      { email: user.email, role: user.role },
    );

    const refreshToken = await this.signToken(
      user.id,
      this.configService.get('jwt.refreshTokenExpiresIn') as string,
      { email: user.email, role: user.role },
    );

    return { accessToken, refreshToken };
  }

  public async generateAccessToken(user: User) {
    const accessToken = await this.signToken<Partial<ActiveUserInterface>>(
      user.id,
      this.configService.get('jwt.expiresIn') as string,
      { email: user.email, role: user.role },
    );

    return { accessToken };
  }
}
