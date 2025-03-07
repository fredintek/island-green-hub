import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
