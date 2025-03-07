import { SetMetadata } from '@nestjs/common';
import { RoleType } from '../enums/role-type.enum';
import { ROLE_TYPE_KEY } from '../constants/role.constants';

export const Roles = (...roleType: RoleType[]) =>
  SetMetadata(ROLE_TYPE_KEY, roleType);
