import { MailerOptions } from '@nestjs-modules/mailer';
import { registerAs } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

const config = {
  transport: {
    host: process.env.MAIL_HOST,
    secure: true,
    port: 465,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASSWORD,
    },
  },
  template: {
    dir: __dirname + '/src/templates',
    adapter: new HandlebarsAdapter(),
    options: {
      strict: true,
    },
  },
} satisfies MailerOptions;

export default registerAs('mailer', (): MailerOptions => config);
