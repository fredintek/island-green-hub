import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class DeleteResourceDto {
  @IsNotEmpty()
  @IsString()
  publicId: string;

  @IsOptional()
  @IsString()
  resourceType?: 'image' | 'video' | 'raw';
}
