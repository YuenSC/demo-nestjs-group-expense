/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { UserGroup } from './entities/user-group.entity';
import { AddUserDto } from './dto/add-user.dto';
import { RemoveUserDto } from './dto/remove-user.dto';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async isUserGroupAdmin(userId: string, groupId: string) {
    const userGroup = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
    });
    return userGroup?.isAdmin || false;
  }

  async addUsersByEntityManager(
    transactionalEntityManager: EntityManager,
    group: Group,
    addUserDto: AddUserDto,
  ) {
    const relatedUser = await this.usersRepository.find({
      where: addUserDto.users.map((user) => ({ id: user.id })),
    });

    const isAdminMap = new Map(
      addUserDto.users.map((user) => [user.id, user.isAdmin || false]),
    );

    relatedUser.forEach((user) => {
      const userGroup = new UserGroup({
        group,
        user,
        isAdmin: isAdminMap.get(user.id) || false,
      });
      transactionalEntityManager.save(userGroup);
    });
  }

  async addUsers(groupId: string, addUserDto: AddUserDto) {
    return 'This action adds new users to a group';
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async removeUsers(groupId: string, removeUserDto: RemoveUserDto) {}
}
