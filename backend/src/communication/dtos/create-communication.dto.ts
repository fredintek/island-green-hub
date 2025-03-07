import {
  IsArray,
  IsEmail,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateCommunicationDto {
  @IsArray()
  @IsPhoneNumber(undefined, { each: true })
  phoneNumber: string[];

  @IsArray()
  @IsEmail({}, { each: true })
  email: string[];

  @IsArray()
  @IsString({ each: true })
  address: string[];
}
