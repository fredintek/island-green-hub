import { IsEnum, IsInt, IsNotEmpty } from 'class-validator';
import { UserRole } from '../user.entity';

export class UserRoleDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsNotEmpty()
  @IsInt()
  userId: number;
}
