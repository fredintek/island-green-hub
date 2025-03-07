import { Module } from '@nestjs/common';
import { SectionController } from './section.controller';
import { SectionService } from './providers/section.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/page/page.entity';
import { Section } from './section.entity';

@Module({
  controllers: [SectionController],
  providers: [SectionService],
  imports: [TypeOrmModule.forFeature([Page, Section])],
})
export class SectionModule {}
