import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { Section } from '../section.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateSectionDto } from '../dtos/create-section.dto';
import { Page } from 'src/page/page.entity';
import { ContentLinkRemovalDto } from '../dtos/remove-link-from-content.dto';
import { linkRemover } from 'src/utils/linkRemover';
import { UpdateSectionDto } from '../dtos/update-section.dto';

@Injectable()
export class SectionService {
  constructor(
    /**
     * Injecting Section Repository
     */
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,

    /**
     * Injecting Section Repository
     */
    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,
  ) {}

  /**
   * Create Section
   */
  public async createSection(createSectionDto: CreateSectionDto) {
    try {
      // Check if the page exists in the database
      const foundPage = await this.pageRepository.findOne({
        where: { id: createSectionDto.page },
      });

      if (!foundPage) {
        throw new NotFoundException(
          `Page ${createSectionDto.page} does not exist`,
        );
      }

      // find if section type exists
      const foundSectionType = await this.sectionRepository.findOne({
        where: {
          type: createSectionDto.type,
          page: {
            id: createSectionDto.page,
          },
        },
      });

      // if section type exists update section else create new section
      if (foundSectionType) {
        foundSectionType.sortId = createSectionDto.sortId;
        foundSectionType.content = createSectionDto.content;
        await this.sectionRepository.save(foundSectionType);
        return {
          message: 'Section updated successfully',
          data: foundSectionType,
        };
      } else {
        // Create a new Section instance and save it to the database
        const newSection = this.sectionRepository.create({
          ...createSectionDto,
          page: foundPage,
        });

        await this.sectionRepository.save(newSection);
        return {
          message: 'Section created successfully',
          data: newSection,
        };
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      } else {
        console.error('Unexpected Error:', error);
        throw new InternalServerErrorException(
          'Something went wrong while creating the section.',
        );
      }
      // if (error.code === 'ER_DUP_ENTRY') {
      //   throw new BadRequestException(
      //     'A section with this type already exists.',
      //   );
      // }
    }
  }

  /**
   * Get All Section By Page Id
   */
  public async getAllSectionByPage(pageId: number) {
    // Check if page exists with provided pageId
    const page = await this.pageRepository.findOne({
      where: { id: pageId },
    });

    if (!page) {
      throw new NotFoundException(`Page with id ${pageId} not found.`);
    }

    // get all section by provided pageId
    const sections = await this.sectionRepository.find({
      where: { page: { id: pageId } },
    });

    return {
      message: 'Sections retrieved successfully',
      data: sections,
    };
  }

  /**
   * Get All Section By Page slug
   */
  public async getAllSectionByPageSlug(slug: string) {
    // Check if page exists with provided pageId
    const page = await this.pageRepository.findOne({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException(`Page with name ${slug} not found.`);
    }

    // get all section by provided pageId
    const sections = await this.sectionRepository.find({
      where: { page: { slug } },
    });

    return {
      message: 'Sections retrieved successfully',
      data: sections,
    };
  }

  /**
   * Get Single Section
   */
  public async getSingleSection(sectionId: number) {
    // find section with the provided id
    const section = await this.sectionRepository.findOne({
      where: { id: sectionId },
    });

    if (!section) {
      throw new NotFoundException(`Section with id ${sectionId} not found.`);
    }

    // return the found section
    return {
      message: 'Section retrieved successfully',
      data: section,
    };
  }

  /**
   * Remove Specific From Section Content
   */
  public async RemoveLinkFromContent(
    contentLinkRemovalDto: ContentLinkRemovalDto,
  ) {
    // find section with the provided id
    const section = await this.sectionRepository.findOne({
      where: { id: contentLinkRemovalDto.sectionId },
    });

    if (!section) {
      throw new NotFoundException(
        `Section with id ${contentLinkRemovalDto.sectionId} not found.`,
      );
    }

    // perform the search removal on the content
    const updatedContent = linkRemover(
      section.content,
      contentLinkRemovalDto.link,
    );

    // save the updated section
    section.content = updatedContent;
    await this.sectionRepository.save(section);
    return {
      message: 'Link removed from content successfully',
      data: section,
    };
  }

  /**
   * Update Section Content
   */

  public async updateSection(updateSectionDto: UpdateSectionDto) {
    const { id, ...updateData } = updateSectionDto;

    try {
      const page = await this.sectionRepository.findOne({ where: { id } });
      if (!page) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }

      // Update the fields dynamically
      Object.assign(page, updateData);

      // Save the updated page
      return await this.sectionRepository.save(page);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || error.response.statusCode,
      );
    }
  }

  /**
   * Get Single Section By Type
   */
  public async getSingleSectionByType(sectionType: string) {
    // find section with the provided id
    const section = await this.sectionRepository.findOne({
      where: { type: sectionType },
      relations: ['page'],
    });

    if (!section) {
      throw new NotFoundException(
        `Section with type ${sectionType} not found.`,
      );
    }

    // return the found section
    return {
      message: 'Section retrieved successfully',
      data: section,
    };
  }
}
