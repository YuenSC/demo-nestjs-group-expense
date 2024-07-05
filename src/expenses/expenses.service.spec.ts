import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Group } from '../groups/entities/group.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';

describe('ExpensesService', () => {
  let service: ExpensesService;
  let expenseRepository: Repository<Expense>;
  let groupRepository: Repository<Group>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ExpensesService,
        {
          provide: getRepositoryToken(Expense),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
            delete: jest.fn(),
            findOneByOrFail: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Group),
          useValue: {
            findOneBy: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ExpensesService>(ExpensesService);
    expenseRepository = module.get<Repository<Expense>>(
      getRepositoryToken(Expense),
    );
    groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create an expense', async () => {
      const groupId = 'test-group-id';
      const createExpenseDto = {
        name: 'Test Expense',
        amount: 100,
        incurredOn: new Date(),
      } satisfies CreateExpenseDto;
      const group = { id: groupId, name: 'Test Group' } as Group;

      jest.spyOn(groupRepository, 'findOneBy').mockResolvedValue(group);
      jest
        .spyOn(expenseRepository, 'save')
        .mockResolvedValue({ ...createExpenseDto, group } as Expense);

      const result = await service.create(groupId, createExpenseDto);

      expect(result).toEqual(expect.objectContaining(createExpenseDto));
      expect(groupRepository.findOneBy).toHaveBeenCalledWith({ id: groupId });
    });

    it('should throw an error if group not found', async () => {
      const groupId = 'invalid-group-id';
      const createExpenseDto = {
        name: 'Test Expense',
        amount: 100,
        incurredOn: new Date(),
      } satisfies CreateExpenseDto;
      jest.spyOn(groupRepository, 'findOneBy').mockResolvedValue(null);

      await expect(service.create(groupId, createExpenseDto)).rejects.toThrow(
        'Group not found',
      );
    });
  });

  // Additional tests for findAll, findOne, update, and remove would follow a similar structure
});
