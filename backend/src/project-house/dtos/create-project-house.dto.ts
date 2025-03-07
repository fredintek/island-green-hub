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
  @IsObject()
  @ValidateNested()
  @Type(() => ImageUrlDto)
  coverImage?: ImageUrlDto;

  @IsNotEmpty()
  @IsObject()
  @ValidateNested()
  @Type(() => ImageUrlDto)
  displayImage?: ImageUrlDto;

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
  @Type(() => MultilingualTextDto)
  optionalFeatures?: MultilingualTextDto;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GalleryImageDto)
  gallery?: GalleryImageDto[];

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  homeText: MultilingualTextDto;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ImageUrlDto)
  homeImages: ImageUrlDto[];
}
