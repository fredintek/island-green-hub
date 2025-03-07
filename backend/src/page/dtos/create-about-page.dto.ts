import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MultilingualTextDto } from 'src/project-house/dtos/create-project-house.dto';

export class CreateBulkAboutPageDto {
  @IsNotEmpty()
  @IsInt()
  parentPageId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title: MultilingualTextDto;

  @IsNotEmpty()
  content: any;

  @IsNotEmpty()
  @IsString()
  sectionType: string;
}
