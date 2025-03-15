import { IsString } from 'class-validator';

export class CreateCommunicationDto {
  @IsString()
  phoneNumber: string;

  @IsString()
  email: string;

  @IsString()
  address: string;
}
