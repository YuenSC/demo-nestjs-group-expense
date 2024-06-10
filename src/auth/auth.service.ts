import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      this.usersService.updateLastLogin(user.id);
      return user;
    }
    return null;
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  generateAccessToken(user: User) {
    return this.jwtService.sign({ username: user.email, sub: user.id });
  }
}
