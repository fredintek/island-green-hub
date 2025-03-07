import { Module } from '@nestjs/common';
import { MailService } from './providers/mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';
import { join } from 'path';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/user.entity';

@Module({
  providers: [MailService],
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get('mail.mailHost'),
          port: Number(configService.get('mail.mailPort')),
          secure: configService.get('mail.mailSecure') === 'true',
          auth: {
            user: configService.get('mail.mailUsername'),
            pass: configService.get('mail.mailPassword'),
          },
        },
        defaults: {
          from: `"NestJS Tutorial" <${configService.get('mail.fromEmail')}>`,
        },
        template: {
          dir: join(__dirname, 'templates'),
          adapter: new PugAdapter({ inlineCssEnabled: true }),
          options: {
            strict: false,
          },
        },
      }),
    }),
    TypeOrmModule.forFeature([User]),
  ],
  exports: [MailService],
})
export class MailModule {}
