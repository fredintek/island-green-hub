import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class MultilingualTextDto {
  @IsNotEmpty()
  @IsString()
  en: string;

  @IsNotEmpty()
  @IsString()
  ru: string;

  @IsNotEmpty()
  @IsString()
  tr: string;
}

export class OptionalMultilingualTextDto {
  @IsOptional()
  @IsString()
  en?: string;

  @IsOptional()
  @IsString()
  ru?: string;

  @IsOptional()
  @IsString()
  tr?: string;
}

export class ImageUrlDto {
  @IsNotEmpty()
  @IsString()
  publicId: string;

  @IsNotEmpty()
  @IsString()
  url: string;
}

export class GalleryImageDto {
  @IsNotEmpty()
  @IsObject()
  @Type(() => ImageUrlDto)
  imageUrl: ImageUrlDto;

  @IsOptional()
  @IsString()
  tag: string;
}

export class CreateProjectHouseDto {
  @IsNotEmpty()
  @IsInt()
  projectPage: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title: MultilingualTextDto;

  @IsNotEmpty()
  @IsString()
  coverImage?: string;

  @IsNotEmpty()
  @IsString()
  displayImage?: string;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  generalInfo: MultilingualTextDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  features?: MultilingualTextDto;

  @IsOptional()
  @ValidateNested()
  @Type(() => OptionalMultilingualTextDto)
  optionalFeatures?: OptionalMultilingualTextDto;

  @IsOptional()
  @IsString({ each: true })
  gallery?: string[];

  @IsOptional()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  homeText: MultilingualTextDto;

  @IsOptional()
  @IsString({ each: true })
  homeImages: string[];
}
