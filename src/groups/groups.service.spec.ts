import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  createMockRepository,
  MockRepository,
} from '../../test/helpers/createMockRepository';
import { User } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { GroupsService } from './groups.service';
import { UserGroupService } from './user-group.service';
import { UsersService } from '../users/users.service';

describe('GroupsService', () => {
  let groupService: GroupsService;
  // let userGroupService: UserGroupService;
  let groupRepository: MockRepository;
  let userRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
        UserGroupService,
        {
          provide: getRepositoryToken(Group),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: createMockRepository(),
        },
        {
          provide: getRepositoryToken(UserGroup),
          useValue: createMockRepository(),
        },
        {
          provide: UsersService,
          useValue: {
            attachSignedUrlToUsers: jest.fn(),
          },
        },
      ],
    }).compile();

    groupService = module.get<GroupsService>(GroupsService);
    groupRepository = module.get<MockRepository>(getRepositoryToken(Group));
    userRepository = module.get<MockRepository>(getRepositoryToken(User));
    // userGroupService = module.get<UserGroupService>(UserGroupService);
  });

  it('should be defined', () => {
    expect(groupService).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create a group', async () => {
      const groupDto = {
        name: 'Test Group',
        description: 'Test Group Description',
      } satisfies CreateGroupDto;
      const creator = { id: 'current-user-id' } as User;

      const createdGroup = {
        ...groupDto,
        createdBy: creator.id,
      };

      const mockUser = { id: 'current-user-id', name: 'Mock User' };
      userRepository.find.mockResolvedValue([mockUser]);

      groupRepository.save.mockResolvedValue(createdGroup);
      expect(await groupService.create(groupDto, creator)).toEqual(
        createdGroup,
      );
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      const expectedUserGroups = [
        { id: '1', name: 'group1' },
        { id: '2', name: 'group2' },
      ] as Group[];

      jest
        .spyOn(groupRepository, 'findAndCount')
        .mockResolvedValueOnce([expectedUserGroups, expectedUserGroups.length]);

      const { items } = await groupService.findAll({ page: 1, pageSize: 10 });
      expect(items).toEqual(expectedUserGroups);
      expect(groupRepository.findAndCount).toHaveBeenCalled();
    });
  });

  // Add more tests for findOne, addUsers, removeUsers, update, and remove methods
});
