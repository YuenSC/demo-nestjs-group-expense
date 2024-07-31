import { Body, Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole, UserStatus } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthGuardJwt } from './auth-guard.jwt';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { SignUpDto } from './dto/signup.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  private async setCookieAndGenerateToken(user, response: Response) {
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
    return access_token;
  }

  @UseGuards(AuthGuardLocal)
  @Post('login')
  async login(
    @CurrentUser() user,
    @Res({ passthrough: true }) response: Response,
  ) {
    const access_token = await this.setCookieAndGenerateToken(user, response);

    return {
      user,
      access_token,
    };
  }

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const createUserDto = {
      ...signUpDto,
      role: UserRole.USER,
      status: UserStatus.INACTIVE,
    } satisfies CreateUserDto;

    const user = await this.usersService.create(createUserDto);
    await this.authService.sendVerificationEmail(user);
    return {
      user,
    };
  }

  @Post('resend-verification-email')
  async resendVerificationEmail(@Body() { email }: { email: string }) {
    return this.authService.resendVerificationEmail(email);
  }

  @Post('verify-email')
  async verifyEmail(
    @Body() { email, otp }: VerifyEmailDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.verifyEmail({
      email,
      otp,
    });
    await this.usersService.update(user.id, {
      status: UserStatus.ACTIVE,
      lastLoginAt: new Date(),
    });
    const access_token = await this.setCookieAndGenerateToken(user, response);

    return {
      message: 'Email verified successfully',
      user,
      access_token,
    };
  }

  @Get('me')
  @UseGuards(AuthGuardJwt)
  async me(@CurrentUser() user) {
    return user;
  }
}
