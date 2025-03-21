import { PartialType } from '@nestjs/mapped-types';
import { CreatePageDto } from './create-page.dto';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { MultilingualTextDto } from 'src/project-house/dtos/create-project-house.dto';
import { Type } from 'class-transformer';

export class UpdatePageDto extends PartialType(CreatePageDto) {
  @IsNotEmpty()
  @IsInt()
  id: number;

  @IsOptional()
  @IsBoolean()
  isProjectHomePage?: boolean;

  @IsOptional()
  @IsString({ each: true })
  projectHomeImages?: string[];

  @IsOptional()
  @Type(() => MultilingualTextDto)
  projectHomeText?: MultilingualTextDto;
}
