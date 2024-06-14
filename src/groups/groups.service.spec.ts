import { Test, TestingModule } from '@nestjs/testing';
import { GroupsService } from './groups.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from './entities/group.entity';
import { User } from '../users/entities/user.entity';
import { UserGroup } from './entities/user-group.entity';
import { Repository } from 'typeorm';
import { CreateGroupDto } from './dto/create-group.dto';

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

describe('GroupsService', () => {
  let service: GroupsService;
  let groupRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupsService,
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

    service = module.get<GroupsService>(GroupsService);
    groupRepository = module.get<MockRepository>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
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

      groupRepository.save.mockResolvedValue(createdGroup);
      expect(await service.create(groupDto, creator)).toEqual(createdGroup);
      expect(groupRepository.save).toHaveBeenCalledWith(createdGroup);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      groupRepository.find.mockResolvedValue(['group1', 'group2']);
      expect(await service.findAll()).toEqual(['group1', 'group2']);
      expect(groupRepository.find).toHaveBeenCalled();
    });
  });

  // Add more tests for findOne, addUsers, removeUsers, update, and remove methods
});
