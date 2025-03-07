import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ProjectHouseService } from './providers/project-house.service';
import { CreateProjectHouseDto } from './dtos/create-project-house.dto';
import { UpdateProjectHouseDto } from './dtos/update-project-house.dto';
import { IsHomePageDto } from './dtos/is-home-page.dto';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RoleType } from 'src/auth/enums/role-type.enum';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { AuthType } from 'src/auth/enums/auth-type.enum';

@Controller('project-house')
export class ProjectHouseController {
  constructor(
    /**
     * Injecting Project House Service
     */
    private readonly projectHouseService: ProjectHouseService,
  ) {}

  @Post()
  createProjectHouse(@Body() createProjectHouseDto: CreateProjectHouseDto) {
    return this.projectHouseService.createProjectHouse(createProjectHouseDto);
  }

  @Patch()
  @Roles(RoleType.Admin, RoleType.Editor)
  updateProjectHouse(@Body() updateProjectHouseDto: UpdateProjectHouseDto) {
    return this.projectHouseService.updateProjectHouse(updateProjectHouseDto);
  }

  @Delete(':projectHouseId')
  deleteProjectHouse(
    @Param('projectHouseId', ParseIntPipe) projectHouseId: number,
  ) {
    return this.projectHouseService.deleteProjectHouse(projectHouseId);
  }

  @Get()
  @Auth(AuthType.None)
  getAllProjectHouses(
    @Query('isHomePage', new ParseBoolPipe({ optional: true }))
    isHomePage?: boolean,
  ) {
    return this.projectHouseService.getAllProjectHouses(isHomePage);
  }

  @Get(':projectHouseId')
  @Auth(AuthType.None)
  getSingleProjectHouse(
    @Param('projectHouseId', ParseIntPipe) projectHouseId: number,
  ) {
    return this.projectHouseService.getProjectHouseById(projectHouseId);
  }

  @Patch('is-home-page')
  @Roles(RoleType.Admin, RoleType.Editor)
  setIsHomePage(@Body() isHomePageDto: IsHomePageDto) {
    return this.projectHouseService.updateIsHomePage(isHomePageDto);
  }
}
