import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
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
  findAll() {
    return this.groupsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.groupsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(IsGroupAdminGuard)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
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
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
