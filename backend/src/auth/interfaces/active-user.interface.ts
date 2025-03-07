import { UserRole } from 'src/user/user.entity';

export interface ActiveUserInterface {
  sub: number;
  email: string;
  role: UserRole;
}
