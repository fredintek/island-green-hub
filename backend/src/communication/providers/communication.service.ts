import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Communication } from '../communication.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateCommunicationDto } from '../dtos/create-communication.dto';
import { UpdateCommunicationDto } from '../dtos/update-communication.dto';

@Injectable()
export class CommunicationService {
  constructor(
    /**
     * Injecting Communication Repository
     */
    @InjectRepository(Communication)
    private readonly communicationRepository: Repository<Communication>,
  ) {}

  /**
   * Create Communication
   */
  public async createCommunication(
    createCommunicationDto: CreateCommunicationDto,
  ) {
    const communication = this.communicationRepository.create({
      phoneNumber: createCommunicationDto.phoneNumber,
      email: createCommunicationDto.email,
      address: createCommunicationDto.address,
    });

    await this.communicationRepository.save(communication);

    return {
      message: 'Communication created successfully',
      data: communication,
    };
  }

  /**
   * Get All Communication
   */
  public async getAllCommunication() {
    const communication = await this.communicationRepository.find({});

    return {
      message: 'Communication retrieved successfully',
      data: communication,
    };
  }

  /**
   * Get Single Communication
   */
  public async getSingleCommunication(communicationId: number) {
    const communication = await this.communicationRepository.findOne({
      where: { id: communicationId },
    });

    if (!communication) {
      throw new NotFoundException(
        `Communication with ID ${communicationId} not found`,
      );
    }

    return {
      message: 'Communication retrieved successfully',
      data: communication,
    };
  }

  /**
   * Update Single Communication
   */
  public async updateCommunication(
    updateCommunicationDto: UpdateCommunicationDto,
  ) {
    const existingCommunication = await this.communicationRepository.findOne({
      where: { id: updateCommunicationDto.id },
    });

    if (!existingCommunication) {
      throw new NotFoundException(
        `Communication with ID ${updateCommunicationDto.id} not found`,
      );
    }

    // Update fields only if provided in DTO
    if (updateCommunicationDto.phoneNumber) {
      existingCommunication.phoneNumber = updateCommunicationDto.phoneNumber;
    }

    if (updateCommunicationDto.email) {
      existingCommunication.email = updateCommunicationDto.email;
    }

    if (updateCommunicationDto.address) {
      existingCommunication.address = updateCommunicationDto.address;
    }

    await this.communicationRepository.save(existingCommunication);

    return {
      message: 'Communication updated successfully',
      data: existingCommunication,
    };
  }

  public async deleteCommunication(communicationId: number) {
    // find communication with the specified ID
    const communication = await this.communicationRepository.findOne({
      where: { id: communicationId },
    });

    if (!communication) {
      throw new NotFoundException(
        `Communication with ID ${communicationId} not found`,
      );
    }

    // delete the communication
    await this.communicationRepository.delete(communicationId);

    return {
      message: 'Communication deleted successfully',
    };
  }
}
