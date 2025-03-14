import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { SectionService } from './providers/section.service';
import { CreateSectionDto } from './dtos/create-section.dto';
import { ContentLinkRemovalDto } from './dtos/remove-link-from-content.dto';
import { UpdateSectionDto } from './dtos/update-section.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { FilesInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { deleteServerFile, getFileUpload } from 'src/utils/uploadFileToSystem';
import { mergeImagesWithTags } from 'src/utils/mergeTagsAndImages';

@Controller('section')
export class SectionController {
  constructor(
    /**
     * Injecting Section Service
     */
    private readonly sectionService: SectionService,
  ) {}

  /**
   * Create Section
   */
  @Post()
  createSection(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionService.createSection(createSectionDto);
  }

  /**
   * Upload Images to server
   */
  @Post('upload-file')
  @UseInterceptors(
    FilesInterceptor('files', 20, {
      storage: memoryStorage(),
      fileFilter: (req, file, cb) => {
        if (
          file.mimetype.startsWith('image/') ||
          file.mimetype.startsWith('application/pdf') ||
          file.mimetype.startsWith('video/')
        ) {
          cb(null, true);
        } else {
          cb(
            new BadRequestException('Only images, videos and pdfs are allowed'),
            false,
          );
        }
      },
      limits: {
        fileSize: 1024 * 1024 * 10, // 10MB
      },
    }),
  )
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body() body: { tags: string | string[] },
  ) {
    let tags: string[];

    if (typeof body.tags === 'string') {
      try {
        tags = JSON.parse(body.tags); // Try to parse as an array
      } catch {
        tags = [body.tags]; // If parsing fails, treat it as a single tag
      }
    } else if (Array.isArray(body.tags)) {
      tags = body.tags;
    } else {
      tags = [];
    }

    // Validate tag length matches file length
    if (tags.length && tags.length !== files.length) {
      throw new BadRequestException(
        'Number of tags must match number of files',
      );
    }

    const uploadedFiles = await Promise.all(files.map(getFileUpload));
    return tags.length
      ? mergeImagesWithTags(uploadedFiles, tags)
      : uploadedFiles;
  }

  /**
   * Delete image file from the server
   */
  @Delete('delete-file')
  async deleteFile(@Body() body: { filename: string }) {
    if (!body.filename) {
      throw new BadRequestException('Filename is required');
    }

    const deletedFile = await deleteServerFile(body.filename);

    if (!deletedFile) {
      throw new NotFoundException('Image not found or could not be deleted');
    }
    return { message: 'Image deleted successfully' };
  }

  /**
   * Update Section Data
   */
  @Patch()
  @Roles(RoleType.Admin, RoleType.Editor)
  updateSection(@Body() updateSectionDto: UpdateSectionDto) {
    return this.sectionService.updateSection(updateSectionDto);
  }

  /**
   * Remove Specific From Section Content
   */
  @Patch('remove-link')
  @Roles(RoleType.Admin, RoleType.Editor)
  RemoveLinkFromContent(@Body() contentLinkRemovalDto: ContentLinkRemovalDto) {
    return this.sectionService.RemoveLinkFromContent(contentLinkRemovalDto);
  }

  /**
   * Get All Section By Page Id
   */
  @Get('/page/:pageId')
  @Auth(AuthType.None)
  getAllSectionByPage(@Param('pageId', ParseIntPipe) pageId: number) {
    return this.sectionService.getAllSectionByPage(pageId);
  }

  /**
   * Get All Section By Page Slug
   */
  @Get('/page/name/:slug')
  @Auth(AuthType.None)
  getAllSectionByPageSlug(@Param('slug') slug: string) {
    return this.sectionService.getAllSectionByPageSlug(slug);
  }

  /**
   * Get Single Section
   */
  @Get(':sectionId')
  @Auth(AuthType.None)
  getSingleSection(@Param('sectionId', ParseIntPipe) sectionId: number) {
    return this.sectionService.getSingleSection(sectionId);
  }

  /**
   * Get Single Section By Type
   */
  @Get('type/:sectionType')
  @Auth(AuthType.None)
  getSingleSectionByType(@Param('sectionType') sectionType: string) {
    return this.sectionService.getSingleSectionByType(sectionType);
  }
}
