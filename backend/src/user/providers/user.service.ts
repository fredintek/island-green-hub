import {
  BadRequestException,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { User } from '../user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { CreateUserDto } from 'src/auth/dtos/create-user.dto';
import { ForgotPasswordDto } from 'src/auth/dtos/forgot-password.dto';
import * as crypto from 'crypto';
import { MailService } from 'src/mail/providers/mail.service';
import { ResetPasswordDto } from 'src/auth/dtos/reset-password.dto';
import { HashingProvider } from 'src/auth/providers/hashing.provider';
import { UserRoleDto } from '../dto/user-role.dto';
import { UpdateUserDto } from 'src/auth/dtos/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    /**
     * Injecting User Repository
     */
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    /**
     * Injecting Mail Service
     */
    private readonly mailService: MailService,

    /**
     * Inject Hashing Provider
     */
    private readonly hashingProvider: HashingProvider,
  ) {}

  public async findOneUserByEmail(email: string) {
    let user: User | null;

    try {
      user = await this.userRepository.findOne({
        where: { email },
      });
    } catch (error) {
      throw new RequestTimeoutException('error', {
        description: 'Could not fetch user',
      });
    }

    if (!user) {
      throw new BadRequestException('user does not exist');
    }
    return user;
  }

  public async createUser(createUserDto: CreateUserDto) {
    let newUser: User;

    // check if user already exists
    const user = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (user) {
      throw new BadRequestException('User already exists');
    }

    try {
      newUser = await this.userRepository.create(createUserDto);
      await this.userRepository.save(newUser);
    } catch (error) {
      throw new RequestTimeoutException('error', {
        description: 'Could not create user',
      });
    }

    return {
      message: 'User created successfully',
      data: newUser,
    };
  }

  public async updateUser(updateUserDto: UpdateUserDto) {
    // check if user exists
    const user = await this.userRepository.findOne({
      where: { id: updateUserDto.userId },
    });

    if (!user) {
      throw new BadRequestException('User does not exists');
    }

    try {
      user.firstname = updateUserDto.firstname || user.firstname;
      user.lastname = updateUserDto.lastname || user.lastname;
      user.role = updateUserDto.role || user.role;
      await this.userRepository.save(user);
    } catch (error) {
      throw new RequestTimeoutException('error', {
        description: 'Could not update user',
      });
    }

    return {
      message: 'User updated successfully',
      data: user,
    };
  }

  public async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: forgotPasswordDto.email,
      },
    });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Generate a secure random token
    const resetToken = crypto.randomBytes(3).toString('hex');
    const hashedResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    const resetTokenExpiration = new Date();
    resetTokenExpiration.setHours(resetTokenExpiration.getHours() + 1); // Token expires in 1 hour

    user.resetToken = hashedResetToken;
    user.resetTokenExpiration = resetTokenExpiration;

    await this.userRepository.save(user);

    // Send email with password reset instructions
    await this.mailService.sendResetPasswordToken(user, resetToken);
    return {
      message: 'Email sent with password reset instructions',
    };
  }

  public async resetPassword(resetPasswordDto: ResetPasswordDto) {
    const hashedToken = crypto
      .createHash('sha256')
      .update(resetPasswordDto.token)
      .digest('hex');

    const user = await this.userRepository.findOne({
      where: {
        email: resetPasswordDto.email,
        resetToken: hashedToken,
        resetTokenExpiration: MoreThanOrEqual(new Date()),
      },
    });

    if (
      !user ||
      !user.resetToken ||
      (user.resetTokenExpiration &&
        new Date(user.resetTokenExpiration) < new Date(Date.now()))
    ) {
      throw new BadRequestException(
        'Invalid token or token has expired or wrong email address',
      );
    }

    const hashedPassword = await this.hashingProvider.hashPassword(
      resetPasswordDto.password,
    );
    user.password = hashedPassword;
    user.resetToken = null;
    user.resetTokenExpiration = null;

    await this.userRepository.save(user);

    return {
      message: 'Password reset successfully',
    };
  }

  public async getAllUsers() {
    // Get all users
    const users = await this.userRepository.find({});
    return {
      message: 'Users retrieved successfully',
      data: users,
    };
  }

  // get single user
  public async getSingleUser(userId: number) {
    // find user with the provided id
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    return {
      message: 'User retrieved successfully',
      data: user,
    };
  }

  public async updateUserRole(userRoleDto: UserRoleDto) {
    // find user with the provided id
    const user = await this.userRepository.findOne({
      where: { id: userRoleDto.userId },
    });

    if (!user) {
      throw new NotFoundException(
        `User with id ${userRoleDto.userId} not found.`,
      );
    }

    user.role = userRoleDto.role;

    await this.userRepository.save(user);

    return {
      message: 'User role updated successfully',
      data: user,
    };
  }

  public async deleteUser(userId: number) {
    // find user with the provided id
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found.`);
    }

    await this.userRepository.delete(userId);

    return {
      message: 'User deleted successfully',
    };
  }
}
