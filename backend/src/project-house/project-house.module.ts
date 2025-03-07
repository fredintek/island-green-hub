import { Module } from '@nestjs/common';
import { ProjectHouseController } from './project-house.controller';
import { ProjectHouseService } from './providers/project-house.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from 'src/page/page.entity';
import { ProjectHouse } from './project-house.entity';

@Module({
  controllers: [ProjectHouseController],
  providers: [ProjectHouseService],
  imports: [TypeOrmModule.forFeature([Page, ProjectHouse])],
})
export class ProjectHouseModule {}
