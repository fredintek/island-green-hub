import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ContentLinkRemovalDto {
  @IsNotEmpty()
  @IsInt()
  sectionId: number;

  @IsNotEmpty()
  @IsString()
  link: string;
}
