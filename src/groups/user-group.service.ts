/* eslint-disable @typescript-eslint/no-unused-vars */
import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { AddUserDto } from './dto/add-user.dto';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';

@Injectable()
export class UserGroupService {
  constructor(
    @InjectRepository(UserGroup)
    private readonly userGroupRepository: Repository<UserGroup>,

    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,

    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async findUsers(groupId: string) {
    const userGroups = await this.userGroupRepository.find({
      where: { groupId },
      relations: ['user'],
    });

    return userGroups.map((userGroup) => userGroup.user);
  }

  async findRelatedGroups(userId: string) {
    const userGroups = await this.userGroupRepository.find({
      where: { userId },
      relations: ['group'],
    });

    return userGroups.map((userGroup) => userGroup.group);
  }

  async isUserGroupAdmin(userId: string, groupId: string) {
    const userGroup = await this.userGroupRepository.findOneBy({
      userId,
      groupId,
    });
    return userGroup?.isAdmin || false;
  }

  async createFirstAdminByEntityManager(
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

    if (relatedUser.length === 0) {
      throw new BadRequestException('No users found');
    }

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
    // 1. Find the Group
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) {
      throw new BadRequestException('Group not found');
    }

    // 2. Validate Users
    const users = await this.usersRepository.find({
      where: addUserDto.users.map((user) => ({ id: user.id })),
    });

    if (users.length !== addUserDto.users.length) {
      throw new BadRequestException('One or more users not found');
    }

    // Initialize arrays for tracking added and failed users
    const addedUsers = [];
    const failedUsers = [];

    // 3. Check for Existing Membership and 4. Add Users to Group
    const userGroupsToAdd = [];
    for (const user of users) {
      const existingMembership = await this.userGroupRepository.findOneBy({
        userId: user.id,
        groupId,
      });

      if (!existingMembership) {
        const isAdmin =
          addUserDto.users.find((dtoUser) => dtoUser.id === user.id)?.isAdmin ||
          false;
        const userGroup = new UserGroup({ group, user, isAdmin });
        userGroupsToAdd.push(userGroup);
        addedUsers.push(user.id); // Add to successful list
      } else {
        failedUsers.push(user.id); // Add to failed list
      }
    }

    // 5. Save the UserGroup Entities
    await this.userGroupRepository.save(userGroupsToAdd);

    // Return the result with details of added and failed users
    return { addedUsers, failedUsers };
  }

  async removeUsers(groupId: string, userId: string) {
    const usersGroups = await this.userGroupRepository.find({
      where: { groupId },
      relations: ['user'],
    });

    // 1. Check if the user is part of the group
    const userGroup = usersGroups.find(
      (userGroup) => userGroup.user.id === userId,
    );
    if (!userGroup) {
      throw new BadRequestException('User not found in the group');
    }

    // 2. Cannot remove if the user is the last admin
    const adminCount = usersGroups.filter((userGroup) => userGroup.isAdmin);
    if (adminCount.length <= 1) {
      throw new BadRequestException('Cannot remove the last admin');
    }

    // 3. Remove users
    const deleteResult = await this.userGroupRepository.delete({ userId });
    if (deleteResult.affected === 0) {
      throw new BadRequestException('User not found in the group');
    }

    return `User with id ${userId} has been removed from the group`;
  }

  async resetAll() {
    return this.userGroupRepository.clear();
  }
}
