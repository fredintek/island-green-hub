import { Module } from '@nestjs/common';
import { CommunicationController } from './communication.controller';
import { CommunicationService } from './providers/communication.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Communication } from './communication.entity';

@Module({
  controllers: [CommunicationController],
  providers: [CommunicationService],
  imports: [TypeOrmModule.forFeature([Communication])],
})
export class CommunicationModule {}
