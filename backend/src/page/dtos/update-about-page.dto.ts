import { PartialType } from '@nestjs/mapped-types';
import { CreateBulkAboutPageDto } from './create-about-page.dto';
import { IsInt, IsNotEmpty } from 'class-validator';

export class UpdateBulkAboutPageDto extends PartialType(
  CreateBulkAboutPageDto,
) {
  @IsNotEmpty()
  @IsInt()
  id: number;
}
