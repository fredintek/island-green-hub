import { PartialType } from '@nestjs/mapped-types';
import { Create360PageDto } from './create-360-page.dto';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class Update360PageDto extends PartialType(Create360PageDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsNotEmpty()
  @IsString()
  sectionType: string;
}
