import { PartialType } from '@nestjs/mapped-types';
import { CreateCommunicationDto } from './create-communication.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateCommunicationDto extends PartialType(
  CreateCommunicationDto,
) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
