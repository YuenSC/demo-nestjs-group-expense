import { Injectable } from '@nestjs/common';
import * as OTPAuth from 'otpauth';

@Injectable()
export class OtpService {
  // every user will have an attribute called otpSecret
  // this attribute will be used to generate the otp by this service
  // and verify the otp by the user

  public otpExpireInSecond = process.env.OTP_EXPIRE_IN_SECOND;

  getOtpExpireInSecond() {
    const period = parseInt(process.env.OTP_EXPIRE_IN_SECOND, 10);
    return Number.isNaN(period) ? 30 : period;
  }

  generateTotp(secret: string) {
    return new OTPAuth.TOTP({
      digits: 6,
      period: this.getOtpExpireInSecond(),
      secret: OTPAuth.Secret.fromBase32(secret),
    });
  }

  generateOTP(secret: string) {
    return this.generateTotp(secret).generate();
  }

  generateOTPSecret() {
    return new OTPAuth.Secret({ size: 20 }).base32;
  }

  validateOTP(token: string, secret: string) {
    const delta = this.generateTotp(secret).validate({ token });
    return delta !== null;
  }
}
