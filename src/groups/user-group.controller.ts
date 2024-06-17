import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { AddUserDto } from './dto/add-user.dto';
import { IsGroupAdminGuard } from './is-group-admin.guard';
import { UserGroupService } from './user-group.service';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';

@UseGuards(AuthGuardJwt)
@Controller('groups/:groupId/users')
export class UserGroupController {
  constructor(private readonly userGroupService: UserGroupService) {}

  @Get()
  findUsers(
    @Param('groupId') groupId: string,
    @Query() paginationFilterDto: PaginationFilterDto,
  ) {
    return this.userGroupService.findUsers(groupId, paginationFilterDto);
  }

  @Post()
  @UseGuards(IsGroupAdminGuard)
  addUsers(@Param('groupId') groupId: string, @Body() addUserDto: AddUserDto) {
    return this.userGroupService.addUsers(groupId, addUserDto);
  }

  @Delete(':userId')
  @UseGuards(IsGroupAdminGuard)
  removeUsers(
    @Param('groupId') groupId: string,
    @Param('userId') userId: string,
  ) {
    return this.userGroupService.removeUsers(groupId, userId);
  }
}
