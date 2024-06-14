import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { AddUserDto } from './dto/add-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { GroupsService } from './groups.service';
import { UserGroupService } from './user-group.service';
import { IsGroupAdminGuard } from './is-group-admin.guard';

@UseGuards(AuthGuardJwt)
@Controller('groups/:groupId/users')
export class UserGroupController {
  constructor(
    private readonly groupsService: GroupsService,
    private readonly userGroupService: UserGroupService,
  ) {}

  @Post()
  @UseGuards(IsGroupAdminGuard)
  addUsers(@Param('groupId') groupId: string, @Body() addUserDto: AddUserDto) {
    return this.userGroupService.addUsers(groupId, addUserDto);
  }

  @Delete()
  @UseGuards(IsGroupAdminGuard)
  removeUsers(
    @Param('groupId') groupId: string,
    @Body() removeUserDto: RemoveUserDto,
  ) {
    return this.userGroupService.removeUsers(groupId, removeUserDto);
  }
}
