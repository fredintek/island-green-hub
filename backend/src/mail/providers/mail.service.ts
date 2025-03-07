import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from 'src/user/user.entity';

@Injectable()
export class MailService {
  constructor(
    /**
     * Injecting MailerService
     */
    private mailerService: MailerService,
  ) {}
  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@example.com',
      subject: 'Welcome to our platform!',
      template: './welcome',
      context: { user },
    });
  }

  public async sendResetPasswordToken(user: User, resetPasswordToken: string) {
    await this.mailerService.sendMail({
      to: user.email,
      from: 'noreply@example.com',
      subject: 'Reset Password Request',
      template: './reset-password',
      context: { user, resetPasswordToken },
    });
  }
}
