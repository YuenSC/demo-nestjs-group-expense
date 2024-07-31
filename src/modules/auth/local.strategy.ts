import {
  BadRequestException,
  Dependencies,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    try {
      const user = await this.authService.validateUser(email, password);
      await this.usersService.updateLastLogin(user.id);

      return user;
    } catch (error) {
      if (error.name === 'EmailNotVerified') {
        throw new UnauthorizedException('Email does not verified yet.');
      }
      throw new BadRequestException(error.message);
    }
  }
}
