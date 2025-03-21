import { IsBoolean, IsInt, IsNotEmpty } from 'class-validator';

export class IsHomePageDto {
  @IsNotEmpty()
  @IsBoolean()
  isHomePage: boolean;

  @IsNotEmpty()
  @IsInt()
  pageId: number;
}
