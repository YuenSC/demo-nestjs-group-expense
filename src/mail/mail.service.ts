// src/mail/mail.service.ts

import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { render } from '@react-email/render';
import GroupExpenseVerifyEmail from '../emails/GroupExpenseVerifyEmail';

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
  }

  async sendEmailValidation({
    email,
    validationCode,
  }: {
    email: string;
    validationCode: string;
  }) {
    return await this.sendMail({
      email,
      subject: '[Group Expense] Email Validation',
      template: GroupExpenseVerifyEmail({ validationCode }),
    });
  }
}
