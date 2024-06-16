import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createMockRepository } from '../../test/helpers/createMockRepository';
import { createMockUserGroup } from '../../test/helpers/createMockUserGroup';
import { User } from '../users/entities/user.entity';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { UserGroupService } from './user-group.service';

describe('UserGroupService', () => {
  let service: UserGroupService;
  let userGroupRepository: Repository<UserGroup>;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UserGroupService,
        {
          provide: getRepositoryToken(UserGroup),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(Group),
          useValue: createMockRepository(),
        },
      ],
    }).compile();

    service = module.get<UserGroupService>(UserGroupService);
    userGroupRepository = module.get<Repository<UserGroup>>(
      getRepositoryToken(UserGroup),
    );
  });

  describe('findUsers', () => {
    it('should return an array of users belonging to a group', async () => {
      const groupId = 'test-group-id';
      const expectedUserGroups = [
        createMockUserGroup(),
        createMockUserGroup(),
      ] satisfies UserGroup[];
      jest
        .spyOn(userGroupRepository, 'find')
        .mockResolvedValueOnce(expectedUserGroups);

      const users = await service.findUsers(groupId);
      expect(users).toEqual(
        expectedUserGroups.map((userGroup) => userGroup.user),
      );
    });
  });

  describe('isUserGroupAdmin', () => {
    it('should return true if the user is an admin of the group', async () => {
      const userId = 'user1';
      const groupId = 'group1';
      jest
        .spyOn(userGroupRepository, 'findOneBy')
        .mockResolvedValueOnce(createMockUserGroup({ isAdmin: true }));

      const isAdmin = await service.isUserGroupAdmin(userId, groupId);
      expect(isAdmin).toBe(true);
    });

    it('should return false if the user is not an admin of the group', async () => {
      const userId = 'user2';
      const groupId = 'group2';
      jest
        .spyOn(userGroupRepository, 'findOneBy')
        .mockResolvedValueOnce(createMockUserGroup({ isAdmin: false }));

      const isAdmin = await service.isUserGroupAdmin(userId, groupId);
      expect(isAdmin).toBe(false);
    });
  });

  // Additional tests for other methods can be added here following the same pattern
});
