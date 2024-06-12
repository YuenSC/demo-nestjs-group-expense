import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';

export default registerAs(
  'auth-jwt-config',
  (): JwtModuleOptions => ({
    secret: process.env.AUTH_SECRET,
    signOptions: {
      expiresIn: process.env.AUTH_ACCESS_TOKEN_EXPIRE_IN,
    },
  }),
);
