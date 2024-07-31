// src/mail/mail.service.ts

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import GroupExpenseVerifyEmail from '../../../emails/GroupExpenseVerifyEmail';
import { formatDuration, intervalToDuration } from 'date-fns';

interface SendMailConfiguration {
  email: string;
  subject: string;
  template: any;
}

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) {}

  private generateEmail = (template: any): string => {
    return render(template);
  };

  async sendMail({ email, subject, template }: SendMailConfiguration) {
    const html = this.generateEmail(template);
    await this.mailerService.sendMail({
      from: process.env.MAIL_USER,
      to: email,
      subject,
      html,
    });

    return {
      message: 'Email sent successfully',
    };
  }

  sendGroupExpenseVerifyEmail({
    email,
    otp,
    otpExpireInSecond,
  }: {
    email: string;
    otp: string;
    otpExpireInSecond: number;
  }) {
    const duration = intervalToDuration({
      start: 0,
      end: otpExpireInSecond * 1000,
    });

    return this.sendMail({
      email,
      subject: '[Group Expense] Email Validation',
      template: GroupExpenseVerifyEmail({
        validationCode: otp,
        expiredPeriod: formatDuration(duration),
      }),
    });
  }
}
