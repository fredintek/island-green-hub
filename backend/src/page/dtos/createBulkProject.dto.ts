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
  projectImage: ImageUrlDto;

  @IsNotEmpty()
  projectPdf: ImageUrlDto;

  @IsString()
  @IsNotEmpty()
  productLink: string;

  @IsNotEmpty()
  projectContent: MultilingualTextDto;

  @IsNotEmpty()
  projectHouseTitle: MultilingualTextDto;

  @IsArray()
  @IsNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => ImageUrlDto)
  projectHomeImage: ImageUrlDto[];

  @IsNotEmpty()
  projectHouseCoverImage: ImageUrlDto;

  @IsNotEmpty()
  projectHouseDisplayImage: ImageUrlDto;

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
  @ValidateNested({ each: true })
  @Type(() => GalleryImageDto)
  projectHouseGallery?: GalleryImageDto[];

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => ImageUrlDto)
  stage2Images?: ImageUrlDto[];

  @IsString()
  @IsOptional()
  projectLocation?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  youtubeVideos?: string[];
}
