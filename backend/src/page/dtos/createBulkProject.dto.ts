import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import {
  GalleryImageDto,
  ImageUrlDto,
  MultilingualTextDto,
} from 'src/project-house/dtos/create-project-house.dto';

export class CreateBulkProjectDto {
  @IsNotEmpty()
  @IsInt()
  parentPageId: number;

  @IsNotEmpty()
  projectTitle: MultilingualTextDto;

  @IsNotEmpty()
  @IsString()
  projectImage: string;

  @IsNotEmpty()
  @IsString()
  projectPdf: string;

  @IsString()
  @IsNotEmpty()
  productLink: string;

  @IsNotEmpty()
  projectContent: MultilingualTextDto;

  @IsNotEmpty()
  projectHouseTitle: MultilingualTextDto;

  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  projectHomeImage: string[];

  @IsNotEmpty()
  @IsString()
  projectHouseCoverImage: string;

  @IsNotEmpty()
  @IsString()
  projectHouseDisplayImage: string;

  @IsNotEmpty()
  projectHomeContent: MultilingualTextDto;

  @IsNotEmpty()
  projectGeneralInfo: MultilingualTextDto;

  @IsNotEmpty()
  projectFeatures: MultilingualTextDto;

  @IsOptional()
  optionalProjectFeatures?: MultilingualTextDto;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  projectHouseGallery?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  stage2Images?: string[];

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  youtubeVideos?: string[];
}
