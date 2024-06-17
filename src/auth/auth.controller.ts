import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UserRole } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthService } from './auth.service';
import { CurrentUser } from './current-user.decorator';
import { SignUpDto } from './dto/signup.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(AuthGuardLocal)
  @Post('login')
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

  @Post('sign-up')
  async signUp(@Body() signUpDto: SignUpDto) {
    const createUserDto = {
      ...signUpDto,
      role: UserRole.USER,
    } satisfies CreateUserDto;

    return await this.usersService.create(createUserDto);
  }
}
