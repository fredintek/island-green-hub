import { Type } from 'class-transformer';
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { MultilingualTextDto } from 'src/project-house/dtos/create-project-house.dto';

export class CreateFaqDto {
  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  question: MultilingualTextDto;

  @IsNotEmpty()
  @ValidateNested()
  @Type(() => MultilingualTextDto)
  answer: MultilingualTextDto;
}
