import { PartialType } from '@nestjs/mapped-types';
import { IsInt, IsNotEmpty } from 'class-validator';
import { CreateProjectHouseDto } from './create-project-house.dto';

export class UpdateProjectHouseDto extends PartialType(CreateProjectHouseDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
