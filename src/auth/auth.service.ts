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

    this.usersService.update(user.id, {
      otpRetryChanceLeft: this.otpService.defaultOtpRetryChanceLeft,
    });
    return await this.sendVerificationEmail(user);
  }

  async verifyEmailAndUpdateLastLogin({ email, otp }: VerifyEmailDto) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) throw new BadRequestException('User not found');
    if (user.status === UserStatus.ACTIVE)
      throw new BadRequestException('User already verified');
    if (user.otpRetryChanceLeft === 0) {
      throw new BadRequestException(
        'OTP retry chance exhausted. Please create a new OTP',
      );
    }
    if (!this.otpService.validateOTP(otp, user.otpSecret)) {
      const chanceLeft = user.otpRetryChanceLeft - 1;
      this.usersService.update(user.id, {
        otpRetryChanceLeft: chanceLeft,
      });
      throw new BadRequestException(
        chanceLeft === 0
          ? 'OTP retry chance exhausted. Please create a new OTP'
          : `Invalid OTP. You can try ${chanceLeft} times more.`,
      );
    }

    await this.usersService.update(user.id, {
      status: UserStatus.ACTIVE,
      lastLoginAt: new Date(),
    });
    return user;
  }
}
