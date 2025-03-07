import {
  Body,
  Controller,
  forwardRef,
  Get,
  Inject,
  Patch,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { SignInDto } from './dtos/sign-in.dto';
import { AuthService } from './providers/auth.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { UserService } from 'src/user/providers/user.service';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { Request, Response } from 'express';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Roles } from './decorators/roles.decorator';
import { RoleType } from './enums/role-type.enum';

@Controller('auth')
export class AuthController {
  constructor(
    /**
     * Injecting Auth Service
     */
    private readonly authService: AuthService,

    /**
     * Inject User Service
     */
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
  ) {}

  /**
   * Sign In User
   */
  @Post('sign-in')
  @Auth(AuthType.None)
  public async signIn(@Body() signInDto: SignInDto, @Res() res: Response) {
    return await this.authService.signIn(signInDto, res);
  }

  @Post('create')
  @Roles(RoleType.Admin)
  public createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Patch('user-update')
  @Roles(RoleType.Admin)
  public updateUser(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(updateUserDto);
  }

  @Patch('forgot-password')
  @Auth(AuthType.None)
  public forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.userService.forgotPassword(forgotPasswordDto);
  }

  @Patch('reset-password')
  @Auth(AuthType.None)
  public resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.userService.resetPassword(resetPasswordDto);
  }

  @Post('logout')
  @Auth(AuthType.None)
  public logout(@Res() res: Response) {
    return this.authService.logout(res);
  }

  @Get('refresh-token')
  @Auth(AuthType.None)
  public refreshToken(@Req() req: Request, @Res() res: Response) {
    return this.authService.refreshToken(req, res);
  }

  @Post('verify-refresh-token')
  @Auth(AuthType.None)
  public verifyRefreshToken(@Body() data: { refreshToken: string }) {
    return this.authService.verifyRefreshToken(data);
  }
}
