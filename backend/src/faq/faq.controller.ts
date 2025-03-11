import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { FaqService } from './providers/faq.service';
import { CreateFaqDto } from './dtos/create-faq.dto';
import { UpdateFaqDto } from './dtos/update-faq.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('faq')
export class FaqController {
  constructor(
    /**
     * Injecting FAQ Service
     */
    private readonly faqService: FaqService,
  ) {}

  /**
   * Get All FAQ
   */
  @Get()
  @Auth(AuthType.None)
  getAllFaq() {
    return this.faqService.getAllFaq();
  }

  /**
   * Get Single FAQ
   */
  @Get(':faqId')
  @Auth(AuthType.None)
  getSingleFaq(@Param('faqId', ParseIntPipe) faqId: number) {
    return this.faqService.getSingleFaq(faqId);
  }

  /**
   * Create FAQ
   */
  @Post()
  createFaq(@Body() createFaqDto: CreateFaqDto) {
    return this.faqService.createFaq(createFaqDto);
  }

  /**
   * Update FAQ
   */
  @Patch()
  @Roles(RoleType.Admin, RoleType.Editor)
  updateFaq(@Body() updateFaqDto: UpdateFaqDto) {
    return this.faqService.updateFaq(updateFaqDto);
  }

  @Delete(':faqId')
  deleteFaq(@Param('faqId', ParseIntPipe) faqId: number) {
    return this.faqService.deleteFaq(faqId);
  }
}
