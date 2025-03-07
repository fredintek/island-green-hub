import { registerAs } from '@nestjs/config';

export default registerAs('jwt', () => ({
  secret: process.env.JWT_SECRET,
  expiresIn: process.env.JWT_ACCESS_TOKEN_TTL,
  audience: process.env.JWT_TOKEN_AUDIENCE,
  issuer: process.env.JWT_TOKEN_ISSUER,
  refreshTokenExpiresIn: process.env.JWT_REFRESH_TOKEN_TTL,
  refreshTokenMaxAge: process.env.REFRESH_TOKEN_MAX_AGE,
}));
