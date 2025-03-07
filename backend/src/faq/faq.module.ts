import { Module } from '@nestjs/common';
import { FaqController } from './faq.controller';
import { FaqService } from './providers/faq.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Faq } from './faq.entity';

@Module({
  controllers: [FaqController],
  providers: [FaqService],
  imports: [TypeOrmModule.forFeature([Faq])],
})
export class FaqModule {}
