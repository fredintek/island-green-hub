import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { DataSource, IsNull, QueryRunner, Repository } from 'typeorm';
import { Page } from '../page.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreatePageDto } from '../dtos/create-page.dto';
import { UpdatePageDto } from '../dtos/update-page.dto';
import { CreateBulkProjectDto } from '../dtos/createBulkProject.dto';
import { Section } from 'src/section/section.entity';
import { ProjectHouse } from 'src/project-house/project-house.entity';
import { CloudinaryService } from 'src/cloudinary/providers/cloudinary.service';
import { Create360PageDto } from '../dtos/create-360-page.dto';
import { Update360PageDto } from '../dtos/update-360-page.dto';
import { CreateBulkAboutPageDto } from '../dtos/create-about-page.dto';
import { UpdateBulkAboutPageDto } from '../dtos/update-about-page.dto';

@Injectable()
export class PageService {
  constructor(
    /**
     * Injecting Page Repository
     */

    @InjectRepository(Page)
    private readonly pageRepository: Repository<Page>,

    /**
     * Injecting Section Repository
     */
    @InjectRepository(Section)
    private readonly sectionRepository: Repository<Section>,

    /**
     * Injecting Project House Repository
     */
    @InjectRepository(ProjectHouse)
    private readonly projectHouseRepository: Repository<ProjectHouse>,

    /**
     * Injecting Datasource
     */
    private readonly datasource: DataSource,

    /**
     * Injecting Cloudinary Service
     */
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  public async createPage(createPageDto: CreatePageDto) {
    let providedParentPage: Page | undefined;

    try {
      if (createPageDto.parentPage) {
        providedParentPage = (await this.pageRepository.findOne({
          where: { id: createPageDto.parentPage },
        })) as Page;

        if (!providedParentPage) {
          throw new BadRequestException('Invalid parent page');
        }
      }

      // Create new page
      const newPage = this.pageRepository.create({
        ...createPageDto,
        parentPage: providedParentPage,
      });

      await this.pageRepository.save(newPage);
      return {
        message: 'Page created successfully',
        data: newPage,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || error.response.statusCode,
      );
    }
  }

  public async createBulkProject(createBulkProjectDto: CreateBulkProjectDto) {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      /**
       * Create a new project page with the page title and parent page (first find parent page)
       */
      const parentPage = createBulkProjectDto.parentPageId
        ? await queryRunner.manager.findOne(Page, {
            where: { id: createBulkProjectDto.parentPageId },
          })
        : null;

      if (!parentPage) {
        throw new BadRequestException('Invalid parent page ID');
      }

      const projectPage = queryRunner.manager.create(Page, {
        title: createBulkProjectDto.projectTitle,
        parentPage,
      });

      await queryRunner.manager.save(projectPage);

      /**
       * Identify sections if any from createBulkProjectDto and create them for the new page
       */

      //product link
      const productLink = await queryRunner.manager.create(Section, {
        page: projectPage,
        type: 'project-product-link',
        sortId: 0,
        content: createBulkProjectDto.productLink,
      });

      await queryRunner.manager.save(productLink);

      // project content
      const projectContent = await queryRunner.manager.create(Section, {
        page: projectPage,
        type: 'project-content',
        sortId: 1,
        content: {
          image: createBulkProjectDto.projectImage,
          pdf: createBulkProjectDto.projectPdf,
          description: createBulkProjectDto.projectContent,
        },
      });
      await queryRunner.manager.save(projectContent);

      // stage 2 section
      const stage2Images = createBulkProjectDto.stage2Images
        ? await queryRunner.manager.create(Section, {
            page: projectPage,
            type: 'project-stage2-images',
            sortId: 2,
            content: createBulkProjectDto.stage2Images,
          })
        : null;
      stage2Images && (await queryRunner.manager.save(stage2Images));

      // project location
      const projectLocation = createBulkProjectDto.projectLocation
        ? await queryRunner.manager.create(Section, {
            page: projectPage,
            type: 'project-location',
            sortId: 3,
            content: createBulkProjectDto.projectLocation,
          })
        : null;
      projectLocation && (await queryRunner.manager.save(projectLocation));

      // project youtube videos
      const youtubeVideos = createBulkProjectDto.youtubeVideos
        ? await queryRunner.manager.create(Section, {
            page: projectPage,
            type: 'project-youtube-videos',
            sortId: 4,
            content: createBulkProjectDto.youtubeVideos,
          })
        : null;
      youtubeVideos && (await queryRunner.manager.save(youtubeVideos));

      /**
       * Identify project house if any and create them for the new project page
       */
      const projectHouse = await queryRunner.manager.create(ProjectHouse, {
        projectPage,
        title: createBulkProjectDto.projectHouseTitle,
        coverImage: createBulkProjectDto.projectHouseCoverImage,
        displayImage: createBulkProjectDto.projectHouseDisplayImage,
        generalInfo: createBulkProjectDto.projectGeneralInfo,
        features: createBulkProjectDto.projectFeatures,
        homeText: createBulkProjectDto.projectHomeContent,
        homeImages: createBulkProjectDto.projectHomeImage,
        optionalFeatures: createBulkProjectDto.optionalProjectFeatures,
        gallery: createBulkProjectDto.projectHouseGallery,
      });
      await queryRunner.manager.save(projectHouse);

      // After successful transaction
      await queryRunner.commitTransaction();

      return {
        message: 'Bulk project created successfully',
        projectPageId: projectPage.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status || 500);
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }

  public async create360Page(create360PageDto: Create360PageDto) {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // get parent page and make sure it exists
      const parentPage = await queryRunner.manager.findOne(Page, {
        where: { id: create360PageDto.parentPageId },
      });

      if (!parentPage) {
        throw new BadRequestException(
          `Parent page with ID ${create360PageDto.parentPageId} not found`,
        );
      }

      // now create page with parentpageID and title
      const newPage = queryRunner.manager.create(Page, {
        title: create360PageDto.title,
        parentPage,
      });

      await queryRunner.manager.save(newPage);

      // create section for the new page with product link
      const productLinkSection = await queryRunner.manager.create(Section, {
        page: newPage,
        type: '360-product-link',
        sortId: 0,
        content: create360PageDto.productLink,
      });
      await queryRunner.manager.save(productLinkSection);

      // now commit and return
      await queryRunner.commitTransaction();

      return {
        message: '360 Page created successfully',
        pageId: newPage.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status || 500);
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }

  public async createBulkAboutPage(
    createBulkAboutPage: CreateBulkAboutPageDto,
  ) {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // get parent page and make sure it exists
      const parentPage = await queryRunner.manager.findOne(Page, {
        where: { id: createBulkAboutPage.parentPageId },
      });

      if (!parentPage) {
        throw new BadRequestException(
          `Parent page with ID ${createBulkAboutPage.parentPageId} not found`,
        );
      }

      // now create page with parentpageID and title
      const newPage = queryRunner.manager.create(Page, {
        title: createBulkAboutPage.title,
        parentPage,
      });

      await queryRunner.manager.save(newPage);

      // create section for the new page with product link
      const productLinkSection = await queryRunner.manager.create(Section, {
        page: newPage,
        type: createBulkAboutPage.sectionType,
        sortId: 0,
        content: createBulkAboutPage.content,
      });
      await queryRunner.manager.save(productLinkSection);

      // now commit and return
      await queryRunner.commitTransaction();

      return {
        message: 'About Page created successfully',
        pageId: newPage.id,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status || 500);
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }

  public async update360Page(update360PageDto: Update360PageDto) {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // get parent page and make sure it exists
      const targetPage = await queryRunner.manager.findOne(Page, {
        where: { id: update360PageDto.id },
      });

      if (!targetPage) {
        throw new BadRequestException(
          `Target page with ID ${update360PageDto.id} not found`,
        );
      }

      targetPage.title = update360PageDto.title || targetPage.title;
      await queryRunner.manager.save(targetPage);

      // get section with the section type and update the section
      const sectionToUpdate = await queryRunner.manager.findOne(Section, {
        where: { type: update360PageDto.sectionType },
      });

      if (!sectionToUpdate) {
        throw new BadRequestException(
          `Section with type ${update360PageDto.sectionType} not found for page ID ${update360PageDto.id}`,
        );
      }

      sectionToUpdate.content =
        update360PageDto.productLink || sectionToUpdate.content;
      await queryRunner.manager.save(sectionToUpdate);

      // now commit and return

      await queryRunner.commitTransaction();

      return {
        message: '360 Page updated successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status || 500);
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }

  public async updateBulkAboutPage(
    updateBulkAboutPageDto: UpdateBulkAboutPageDto,
  ) {
    const queryRunner = this.datasource.createQueryRunner();

    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      // get parent page and make sure it exists
      const targetPage = await queryRunner.manager.findOne(Page, {
        where: { id: updateBulkAboutPageDto.id },
      });

      if (!targetPage) {
        throw new BadRequestException(
          `Target page with ID ${updateBulkAboutPageDto.id} not found`,
        );
      }

      targetPage.title = updateBulkAboutPageDto.title || targetPage.title;
      await queryRunner.manager.save(targetPage);

      // get section with the section type and update the section
      const sectionToUpdate = await queryRunner.manager.findOne(Section, {
        where: { type: updateBulkAboutPageDto.sectionType },
      });

      if (!sectionToUpdate) {
        throw new BadRequestException(
          `Section with type ${updateBulkAboutPageDto.sectionType} not found for page ID ${updateBulkAboutPageDto.id}`,
        );
      }

      sectionToUpdate.content =
        updateBulkAboutPageDto.content || sectionToUpdate.content;
      sectionToUpdate.type =
        updateBulkAboutPageDto.sectionType || sectionToUpdate.type;
      await queryRunner.manager.save(sectionToUpdate);

      // now commit and return

      await queryRunner.commitTransaction();

      return {
        message: 'About Updated created successfully',
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new HttpException(error.message, error.status || 500);
    } finally {
      try {
        // release connection
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }

  public async updatePage(updatePageDto: UpdatePageDto) {
    const { id, ...updateData } = updatePageDto;

    try {
      const page = await this.pageRepository.findOne({ where: { id } });
      if (!page) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }

      // Update the fields dynamically
      Object.assign(page, updateData);

      if (updatePageDto.parentPage) {
        const parentPage = await this.pageRepository.findOne({
          where: { id: updatePageDto.parentPage },
        });

        if (!parentPage) {
          throw new BadRequestException(
            `Parent page with ID ${updatePageDto.parentPage} not found`,
          );
        }
        page.parentPage = parentPage;
      }

      // Save the updated page
      return await this.pageRepository.save(page);
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || error.response.statusCode,
      );
    }
  }

  public async fetchSinglePage(id: number) {
    const pages = await this.pageRepository.findOne({
      where: { id },
      relations: ['subPages', 'parentPage', 'projectHouse', 'sections'],
    });
    return pages;
  }

  public async fetchPageBySlug(slug: string) {
    const page = await this.pageRepository.findOne({
      where: { slug },
      relations: ['subPages', 'parentPage', 'projectHouse', 'sections'],
    });
    return page;
  }

  public async fetchAllPages() {
    const pages = await this.pageRepository.find({
      relations: ['subPages', 'sections'],
      where: {
        parentPage: IsNull(),
      },
    });
    return pages;
  }

  public async deleteSinglePage(id: number) {
    const deletedPage = await this.pageRepository.delete({ id });
    return deletedPage;
  }

  public async deleteBulkProject(id: number) {
    const queryRunner: QueryRunner = this.datasource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // fetch the page along with the sections and project houses
      const page = await queryRunner.manager.findOne(Page, {
        where: { id },
        relations: ['sections', 'projectHouse'],
      });

      if (!page) {
        throw new NotFoundException(`Page with ID ${id} not found`);
      }

      const publicIdsToDelete: string[] = [];

      // Check Project House for images
      for (const projectHouse of page.projectHouse) {
        if (projectHouse.coverImage?.publicId) {
          publicIdsToDelete.push(projectHouse.coverImage.publicId);
        }
        if (projectHouse.displayImage?.publicId) {
          publicIdsToDelete.push(projectHouse.displayImage.publicId);
        }
        if (projectHouse.gallery) {
          for (const galleryItem of projectHouse.gallery) {
            if (galleryItem.imageUrl?.publicId) {
              publicIdsToDelete.push(galleryItem.imageUrl.publicId);
            }
          }
        }
        if (projectHouse.homeImages) {
          for (const homeImage of projectHouse.homeImages) {
            if (homeImage.publicId) {
              publicIdsToDelete.push(homeImage.publicId);
            }
          }
        }
      }

      // Check Sections for images (assuming sections.content may contain images)
      for (const section of page.sections) {
        if (section.content && Array.isArray(section.content)) {
          for (const contentItem of section.content) {
            if (contentItem?.publicId) {
              publicIdsToDelete.push(contentItem.publicId);
            }
          }
        }
      }

      try {
        // Delete images from Cloudinary
        for (const publicId of publicIdsToDelete) {
          await this.cloudinaryService.deleteImage({ publicId });
        }
      } catch (error) {
        throw new InternalServerErrorException(
          'Failed to delete images from cloud',
        );
      }

      // Delete the page and its related entities using QueryRunner
      await queryRunner.manager.delete(Page, { id });

      // Commit transaction
      await queryRunner.commitTransaction();

      return { message: 'Project deleted successfully' };
    } catch (error) {
      await queryRunner.rollbackTransaction(); // Rollback on error
      throw error;
    } finally {
      try {
        await queryRunner.release();
      } catch (error) {
        throw new RequestTimeoutException(
          'Could not release connection transaction',
          { description: String(error) },
        );
      }
    }
  }
}
