import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { DeleteResourceDto } from '../dtos/delete-resource.dto';

@Injectable()
export class CloudinaryService {
  constructor(
    /**
     * Injecting the configservice
     */
    private readonly configService: ConfigService,
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }
  async deleteImage(deleteResourceDto: DeleteResourceDto) {
    if (!deleteResourceDto.publicId) {
      throw new HttpException('Public ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await cloudinary.uploader.destroy(
        deleteResourceDto.publicId,
        {
          resource_type: deleteResourceDto.resourceType || 'image',
        },
      );
      return { message: 'File deleted successfully' };
    } catch (error) {
      console.error('Cloudinary Deletion Error:', error);
      throw new InternalServerErrorException('Failed to delete file');
    }
  }
}
