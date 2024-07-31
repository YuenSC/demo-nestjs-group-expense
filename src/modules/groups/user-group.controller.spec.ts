import { Test, TestingModule } from '@nestjs/testing';
import { UserGroupController } from './user-group.controller';
import { UserGroupService } from './user-group.service';
import { createMockUser } from '../../../test/helpers/createMockUser';
import { PaginationDto } from '../../common/pagination/pagination.dto';
import { User } from '../users/entities/user.entity';

describe('UserGroupController', () => {
  let controller: UserGroupController;
  let userGroupService: UserGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserGroupController],
      providers: [
        {
          provide: UserGroupService,
          useValue: {
            findUsers: jest.fn(),
            addUsers: jest.fn(),
            removeUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UserGroupController>(UserGroupController);
    userGroupService = module.get<UserGroupService>(UserGroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('findUsers', () => {
    it('should return an array of users', async () => {
      const mockUsers = [createMockUser(), createMockUser()];
      jest.spyOn(userGroupService, 'findUsers').mockImplementation(
        async () =>
          ({
            items: mockUsers,
            meta: {
              hasNextPage: false,
              hasPreviousPage: false,
              pageCount: 1,
              page: 1,
              pageSize: 10,
              totalItemCount: 2,
            },
          }) satisfies PaginationDto<User>,
      );

      const { items } = await controller.findUsers('groupId', {
        page: 1,
        pageSize: 10,
      });

      expect(items).toBe(mockUsers);
    });
  });

  describe('addUsers', () => {
    it('should add users and return the result', async () => {
      const addUserDto = { users: [{ id: 'user1', isAdmin: false }] };
      const result = { addedUsers: ['user1'], failedUsers: [] };
      jest.spyOn(userGroupService, 'addUsers').mockImplementation(async () => ({
        addedUsers: ['user1'],
        failedUsers: [],
      }));

      expect(await controller.addUsers('groupId', addUserDto)).toStrictEqual(
        result,
      );
    });
  });

  describe('removeUsers', () => {
    it('should remove a user and return the result', async () => {
      const mockUserId = 'userId';
      const result = `User with id ${mockUserId} has been removed from the group`;
      jest
        .spyOn(userGroupService, 'removeUsers')
        .mockImplementation(async () => result);

      expect(await controller.removeUsers('groupId', mockUserId)).toBe(result);
    });
  });
});
