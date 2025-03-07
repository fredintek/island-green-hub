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
import { CommunicationService } from './providers/communication.service';
import { CreateCommunicationDto } from './dtos/create-communication.dto';
import { UpdateCommunicationDto } from './dtos/update-communication.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('communication')
export class CommunicationController {
  constructor(
    /**
     * Injecting Communication Service
     */
    private readonly communicationService: CommunicationService,
  ) {}

  /**
   * Create a new Communication
   */
  @Post()
  createCommunication(@Body() createCommunicationDto: CreateCommunicationDto) {
    return this.communicationService.createCommunication(
      createCommunicationDto,
    );
  }

  @Get()
  @Auth(AuthType.None)
  getAllCommunication() {
    return this.communicationService.getAllCommunication();
  }

  @Get(':communicationId')
  @Roles(RoleType.Admin, RoleType.Editor)
  getCommunicationById(
    @Param('communicationId', ParseIntPipe) communicationId: number,
  ) {
    return this.communicationService.getSingleCommunication(communicationId);
  }

  @Patch()
  @Roles(RoleType.Admin, RoleType.Editor)
  updateCommunication(@Body() updateCommunicationDto: UpdateCommunicationDto) {
    return this.communicationService.updateCommunication(
      updateCommunicationDto,
    );
  }

  @Delete(':communicationId')
  deleteCommunication(
    @Param('communicationId', ParseIntPipe) communicationId: number,
  ) {
    return this.communicationService.deleteCommunication(communicationId);
  }
}
