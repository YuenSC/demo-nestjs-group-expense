import { Module } from '@nestjs/common';
import { GroupsService } from './groups.service';
import { GroupsController } from './groups.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupService } from './user-group.service';
import { UserGroupController } from './user-group.controller';

@Module({
  imports: [TypeOrmModule.forFeature([User, Group, UserGroup])],
  controllers: [GroupsController, UserGroupController],
  providers: [GroupsService, UserGroupService],
})
export class GroupsModule {}
