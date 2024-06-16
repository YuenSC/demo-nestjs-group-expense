import { Test, TestingModule } from '@nestjs/testing';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { User, UserRole } from '../users/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { createMockRepository } from '../../test/helpers/createMockRepository';
import { UserGroupService } from './user-group.service';
import { createMockUser } from '../../test/helpers/createMockUser';

describe('GroupsController', () => {
  let controller: GroupsController;
  let groupService: GroupsService;
  let userGroupService: UserGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupsController],
      providers: [
        {
          provide: GroupsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            addUsers: jest.fn(),
            removeUsers: jest.fn(),
          },
        },
        {
          provide: UserGroupService,
          useValue: {
            addUsers: jest.fn(),
            removeUsers: jest.fn(),
            findRelatedGroups: jest.fn(),
          },
        },
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
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    groupService = module.get<GroupsService>(GroupsService);
    userGroupService = module.get<UserGroupService>(UserGroupService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const dto = new CreateGroupDto();
      const creator = { id: 'current-user-id' } as User;
      (groupService.create as jest.Mock).mockResolvedValue('someGroup');
      expect(await controller.create(dto, creator)).toBe('someGroup');
      expect(groupService.create).toHaveBeenCalledWith(dto, creator);
    });
  });

  describe('findAll should return all groups for admin', () => {
    const adminUser = createMockUser({ role: UserRole.ADMIN });
    it('should return an array of groups', async () => {
      (groupService.findAll as jest.Mock).mockResolvedValue([
        'group1',
        'group2',
      ]);
      expect(await controller.findAll(adminUser)).toEqual(['group1', 'group2']);
      expect(groupService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAll should return related groups for user', () => {
    const user = createMockUser({ role: UserRole.USER });
    it('should return an array of groups', async () => {
      (userGroupService.findRelatedGroups as jest.Mock).mockResolvedValue([
        'group1',
        'group2',
      ]);
      expect(await controller.findAll(user)).toEqual(['group1', 'group2']);
      expect(userGroupService.findRelatedGroups).toHaveBeenCalled();
    });
  });
});
