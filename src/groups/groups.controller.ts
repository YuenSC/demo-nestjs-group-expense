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

@UseGuards(AuthGuardJwt)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Post()
  create(@Body() createGroupDto: CreateGroupDto) {
    return this.groupsService.create(createGroupDto);
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
  addUsers(@Param('id') id: string, @Body() addUserDto: AddUserDto) {
    return this.groupsService.addUsers(id, addUserDto);
  }

  @Delete(':id/users')
  removeUsers(@Param('id') id: string, @Body() removeUserDto: RemoveUserDto) {
    return this.groupsService.removeUsers(id, removeUserDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.groupsService.remove(id);
  }
}
