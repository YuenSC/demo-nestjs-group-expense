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

@Injectable()
@Dependencies(AuthService)
export class LocalStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(LocalStrategy.name);

  constructor(private readonly authService: AuthService) {
    super({
      usernameField: 'email',
    });
  }

  async validate(email: string, password: string) {
    try {
      await this.authService.validateUserAndUpdateLastLogin(email, password);
    } catch (error) {
      if (error.name === 'EmailNotVerified') {
        throw new UnauthorizedException('Email does not verified yet.');
      }
      throw new BadRequestException(error.message);
    }
  }
}
