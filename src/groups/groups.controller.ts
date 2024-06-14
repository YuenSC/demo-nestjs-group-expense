import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GroupsService } from './groups.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { AddUserDto } from './dto/add-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
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

  @Post(':id/users')
  @UseGuards(IsGroupAdminGuard)
  addUsers(@Param('id') id: string, @Body() addUserDto: AddUserDto) {
    return this.userGroupService.addUsers(id, addUserDto);
  }

  @Delete(':id/users')
  @UseGuards(IsGroupAdminGuard)
  removeUsers(@Param('id') id: string, @Body() removeUserDto: RemoveUserDto) {
    return this.userGroupService.removeUsers(id, removeUserDto);
  }

  @Patch(':id')
  @UseGuards(IsGroupAdminGuard)
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  @UseGuards(IsGroupAdminGuard)
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
