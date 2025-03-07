import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { SectionService } from './providers/section.service';
import { CreateSectionDto } from './dtos/create-section.dto';
import { ContentLinkRemovalDto } from './dtos/remove-link-from-content.dto';
import { UpdateSectionDto } from './dtos/update-section.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';

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
   * Update Section Data
   */
  @Patch()
  @Roles(RoleType.Admin, RoleType.Editor)
  updatePage(@Body() updateSectionDto: UpdateSectionDto) {
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
