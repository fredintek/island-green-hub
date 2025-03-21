import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendNewsLetterDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
