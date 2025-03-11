import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './providers/user.service';
import { UserRoleDto } from './dto/user-role.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('user')
export class UserController {
  constructor(
    /**
     * Injecting User Service
     */
    private readonly userService: UserService,
  ) {}

  @Get()
  @Roles(RoleType.Editor, RoleType.Admin)
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get(':userId')
  @Roles(RoleType.Admin, RoleType.Editor)
  getSingleUser(@Param('userId') userId: number) {
    return this.userService.getSingleUser(userId);
  }

  // change user role
  @Patch('role')
  async updateUserRole(@Body() userRoleDto: UserRoleDto) {
    return this.userService.updateUserRole(userRoleDto);
  }

  // delete user
  @Delete(':userId')
  @Roles(RoleType.Admin)
  deleteUser(@Param('userId') userId: number) {
    return this.userService.deleteUser(userId);
  }
}
