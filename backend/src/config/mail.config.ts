import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  mailHost: process.env.MAIL_HOST,
  mailPort: process.env.MAIL_PORT,
  mailUsername: process.env.MAIL_USERNAME,
  mailPassword: process.env.MAIL_PASSWORD,
  fromEmail: process.env.FROM_EMAIL,
  mailSecure: process.env.SMTP_SECURE,
}));
