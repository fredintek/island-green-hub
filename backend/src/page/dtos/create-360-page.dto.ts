import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { MultilingualTextDto } from 'src/project-house/dtos/create-project-house.dto';

export class Create360PageDto {
  @IsNotEmpty()
  @IsInt()
  parentPageId: number;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  title: MultilingualTextDto;

  @IsNotEmpty()
  @IsString()
  productLink: string;
}
