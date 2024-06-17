import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMockGroup } from '../../test/helpers/createMockGroup';
import { createMockRepository } from '../../test/helpers/createMockRepository';
import { createMockUser } from '../../test/helpers/createMockUser';
import { createMockUserGroup } from '../../test/helpers/createMockUserGroup';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';
import { PaginationDto } from '../pagination/pagination.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { CreateGroupDto } from './dto/create-group.dto';
import { Group } from './entities/group.entity';
import { UserGroup } from './entities/user-group.entity';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';
import { UserGroupService } from './user-group.service';

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
      const mockGroups = [createMockGroup(), createMockGroup()];

      jest.spyOn(groupService, 'findAll').mockResolvedValueOnce({
        items: mockGroups,
        meta: {
          hasNextPage: false,
          hasPreviousPage: false,
          pageCount: 1,
          page: 1,
          pageSize: 10,
          totalItemCount: 2,
        },
      } satisfies PaginationDto<Group>);

      const paginationFilterDto = {
        page: 1,
        pageSize: 10,
      } satisfies PaginationFilterDto;

      const { items } = await controller.findAll(
        adminUser,
        paginationFilterDto,
      );
      expect(items).toEqual(mockGroups);
      expect(groupService.findAll).toHaveBeenCalled();
    });
  });

  describe('findAll should return related groups for user', () => {
    const user = createMockUser({ role: UserRole.USER });
    const paginationFilterDto = {
      page: 1,
      pageSize: 10,
    } satisfies PaginationFilterDto;

    it('should return an array of groups', async () => {
      const mockUserGroups = [createMockUserGroup(), createMockUserGroup()];

      jest.spyOn(userGroupService, 'findRelatedGroups').mockResolvedValue({
        items: mockUserGroups.map((userGroup) => userGroup.group),
        meta: {
          hasNextPage: false,
          hasPreviousPage: false,
          pageCount: 1,
          page: 1,
          pageSize: 10,
          totalItemCount: 2,
        },
      } satisfies PaginationDto<Group>);

      const { items } = await controller.findAll(user, paginationFilterDto);

      expect(items).toEqual(mockUserGroups.map((userGroup) => userGroup.group));
      expect(userGroupService.findRelatedGroups).toHaveBeenCalled();
    });
  });
});
