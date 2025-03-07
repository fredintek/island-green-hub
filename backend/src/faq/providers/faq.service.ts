import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Faq } from '../faq.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateFaqDto } from '../dtos/create-faq.dto';
import { UpdateFaqDto } from '../dtos/update-faq.dto';

@Injectable()
export class FaqService {
  constructor(
    /**
     * Injecting the FAQ Repository
     */
    @InjectRepository(Faq)
    private readonly faqRepository: Repository<Faq>,
  ) {}

  /**
   *  Get All FAQs
   */
  public async getAllFaq() {
    const faqs = await this.faqRepository.find();
    return {
      message: 'Successfully retrieved all FAQs',
      data: faqs,
    };
  }

  /**
   *  Get Single FAQ
   */
  public async getSingleFaq(faqId: number) {
    const faq = await this.faqRepository.findOne({ where: { id: faqId } });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${faqId} not found`);
    }

    return {
      message: 'Successfully retrieved FAQ',
      data: faq,
    };
  }

  /**
   *  Create FAQ
   */
  public async createFaq(createFaqDto: CreateFaqDto) {
    const newFaq = await this.faqRepository.create(createFaqDto);

    await this.faqRepository.save(newFaq);

    return {
      message: 'FAQ created successfully',
      data: newFaq,
    };
  }

  /**
   *  Update FAQ
   */
  public async updateFaq(updateFaqDto: UpdateFaqDto) {
    const { id, ...updateData } = updateFaqDto;

    // find existing Faq
    const faq = await this.faqRepository.findOne({ where: { id } });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${id} not found`);
    }

    // update the fields dynamically
    Object.assign(faq, updateData);

    // save the updated Faq
    await this.faqRepository.save(faq);

    return {
      message: 'FAQ updated successfully',
      data: faq,
    };
  }

  /**
   *  Delete FAQ
   */
  public async deleteFaq(faqId: number) {
    const faq = await this.faqRepository.findOne({ where: { id: faqId } });

    if (!faq) {
      throw new NotFoundException(`FAQ with ID ${faqId} not found`);
    }

    await this.faqRepository.delete(faqId);

    return {
      message: 'FAQ deleted successfully',
    };
  }
}
