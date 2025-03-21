import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class ConsultExpertDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
