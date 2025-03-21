import { Module } from '@nestjs/common';
import { InfoController } from './info.controller';
import { InfoService } from './providers/info.service';
import { MailModule } from 'src/mail/mail.module';

@Module({
  controllers: [InfoController],
  providers: [InfoService],
  imports: [MailModule],
})
export class InfoModule {}
