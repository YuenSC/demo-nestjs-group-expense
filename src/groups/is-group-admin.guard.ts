import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { User } from '../users/entities/user.entity';
import { UserGroupService } from './user-group.service';

@Injectable()
export class IsGroupAdminGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private userGroupService: UserGroupService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const groupId = request.params.id;

    const isValid = await this.validateRequest(user, groupId);
    if (!isValid) {
      throw new ForbiddenException('You are not the group admin of this group');
    }
    return isValid;
  }

  async validateRequest(user: User, groupId: string): Promise<boolean> {
    return await this.userGroupService.isUserGroupAdmin(user.id, groupId);
  }
}
