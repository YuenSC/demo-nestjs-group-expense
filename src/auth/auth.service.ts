import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { User, UserStatus } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { VerifyEmailDto } from './dto/verify-email.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    @Inject(forwardRef(() => UsersService))
    private usersService: UsersService,
    private jwtService: JwtService,
    private mailService: MailService,
    private otpService: OtpService,
  ) {}

  async validateUserAndUpdateLastLogin(email: string, password: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new Error('No user found with this email address.');
    }

    if (user?.status === UserStatus.INACTIVE) {
      const error = new Error('Email does not verified yet.');
      error.name = 'EmailNotVerified';
      throw error;
    }

    if (!(await bcrypt.compare(password, user.password))) {
      throw new Error('Invalid password.');
    }

    await this.usersService.updateLastLogin(user.id);
    return user;
  }

  hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  generateAccessToken(user: User) {
    return this.jwtService.sign({ username: user.email, sub: user.id });
  }

  async sendVerificationEmail(user: User) {
    const otp = this.otpService.generateOTP(user.otpSecret);
    const otpExpireInSecond = this.otpService.getOtpExpireInSecond();

    return await this.mailService.sendGroupExpenseVerifyEmail({
      email: user.email,
      otp,
      otpExpireInSecond,
    });
  }

  async resendVerificationEmail(email: string) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    if (user.status === UserStatus.ACTIVE)
      throw new BadRequestException('User already verified');
    return await this.sendVerificationEmail(user);
  }

  async verifyEmailAndUpdateLastLogin({ email, otp }: VerifyEmailDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    if (user.status === UserStatus.ACTIVE)
      throw new BadRequestException('User already verified');
    if (!this.otpService.validateOTP(otp, user.otpSecret))
      throw new BadRequestException('Invalid OTP');

    await this.usersService.update(user.id, {
      status: UserStatus.ACTIVE,
      lastLoginAt: new Date(),
    });
    return user;
  }
}
