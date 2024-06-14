import { Test, TestingModule } from '@nestjs/testing';
import { CreateGroupDto } from './dto/create-group.dto';
import { GroupsController } from './groups.controller';
import { GroupsService } from './groups.service';

describe('GroupsController', () => {
  let controller: GroupsController;
  let service: GroupsService;

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
      ],
    }).compile();

    controller = module.get<GroupsController>(GroupsController);
    service = module.get<GroupsService>(GroupsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a group', async () => {
      const dto = new CreateGroupDto();
      (service.create as jest.Mock).mockResolvedValue('someGroup');
      expect(await controller.create(dto)).toBe('someGroup');
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('should return an array of groups', async () => {
      (service.findAll as jest.Mock).mockResolvedValue(['group1', 'group2']);
      expect(await controller.findAll()).toEqual(['group1', 'group2']);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
});
