import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { MultilingualTextDto } from 'src/project-house/dtos/create-project-house.dto';

export class CreatePageDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title: MultilingualTextDto;

  @IsOptional()
  @IsNumber()
  parentPage?: number;
}
