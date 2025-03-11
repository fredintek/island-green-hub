import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CloudinaryService } from './providers/cloudinary.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { DeleteResourceDto } from './dtos/delete-resource.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';

@Controller('cloudinary')
export class CloudinaryController {
  constructor(
    /**
     * Injecting Cloudinary service
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @Delete('remove-file')
  @Roles(RoleType.Admin, RoleType.Editor)
  deleteImage(@Body() deleteResourceDto: DeleteResourceDto) {
    return this.cloudinaryService.deleteImage(deleteResourceDto);
  }
}
