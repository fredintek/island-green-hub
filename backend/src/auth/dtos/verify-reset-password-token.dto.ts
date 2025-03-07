import { IsNotEmpty, IsString, Length } from 'class-validator';

export class VerifyResetPasswordTokenDto {
  @IsNotEmpty()
  @IsString()
  @Length(6)
  token: string;
}
