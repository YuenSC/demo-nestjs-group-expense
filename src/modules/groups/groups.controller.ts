import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UUIDParam } from '../../common/decorators/uuid-param.decorator';
import { PaginationFilterDto } from '../../common/pagination/pagination-filter.dto';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { CurrentUser } from '../auth/current-user.decorator';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';
import { IsGroupAdminGuard } from './is-group-admin.guard';
import { UserGroupService } from './user-group.service';

@UseGuards(AuthGuardJwt)
@Controller('groups')
export class GroupsController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto, @CurrentUser() user: User) {
    return this.groupsService.create(createGroupDto, user);
  }

  @Get()
  findAll(
    @CurrentUser() user: User,
    @Query() paginationFilterDto: PaginationFilterDto,
  ) {
    if (user.role === UserRole.ADMIN) {
      return this.groupsService.findAll(paginationFilterDto);
    } else if (user.role === UserRole.USER) {
      return this.userGroupService.findRelatedGroups(
        user.id,
        paginationFilterDto,
      ); // Assume findRelated is a method that returns groups related to the user
    } else {
      throw new UnauthorizedException(
        'You do not have permission to access this resource.',
      );
    }
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(IsGroupAdminGuard)
  update(@UUIDParam('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete('reset-all')
  resetAll() {
    if (process.env.NODE_ENV !== 'local')
      throw new Error('This endpoint is only available in test environment');

    return this.groupsService.resetAll();
  }

  @Delete(':id')
  @UseGuards(IsGroupAdminGuard)
  remove(@UUIDParam('id') id: string) {
    return this.groupsService.remove(id);
  }
}
