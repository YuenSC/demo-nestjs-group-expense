import { Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuardLocal } from './auth-guard.local';
import { CurrentUser } from './current-user.decorator';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(AuthGuardLocal)
  @Post('auth/login')
  async login(@CurrentUser() user) {
    return {
      user,
      access_token: this.authService.generateAccessToken(user),
    };
  }
}
