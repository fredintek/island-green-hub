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

  /**
   * send welcome email for newly registered users
   */
  public async sendUserWelcome(user: User): Promise<void> {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to our platform!',
      template: './welcome',
      context: { user },
    });
  }

  /**
   * send reset password token email
   */
  public async sendResetPasswordToken(user: User, resetPasswordToken: string) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Reset Password Request',
      template: './reset-password',
      context: { user, resetPasswordToken },
    });
  }

  /**
   * send user register to news letter
   */
  public async recievedNewsletter(email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Welcome to Our Newsletter!',
      template: './newsletter-recieved',
    });
  }

  /**
   * send career application recieved email
   */
  public async recievedCareerApplication(user: {
    email: string;
    name: string;
  }) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Application Received',
      template: './career-application-recieved',
      context: { user },
    });
  }

  /**
   * send consultation request recieved email
   */
  public async consultationRequestRecieved(user: {
    email: string;
    name: string;
  }) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Your Consultation Request is Received',
      template: './consultation-request-recieved',
      context: { user },
    });
  }
}
