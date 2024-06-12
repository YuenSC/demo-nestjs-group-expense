import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  @UseGuards(AuthGuardLocal)
  @Post('auth/login')
  async login(
    @CurrentUser() user,
    @Res({ passthrough: true }) response: Response,
  ) {
    const access_token = this.authService.generateAccessToken(user);

    response.cookie('access_token', access_token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      expires: new Date(
        Date.now() +
          +this.configService.get('auth-jwt-config.signOptions.expiresIn'),
      ),
    });

    return {
      user,
      access_token,
    };
  }
}
