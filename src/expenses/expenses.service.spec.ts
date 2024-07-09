import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesService } from './expenses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Expense } from './entities/expense.entity';
import { Group } from '../groups/entities/group.entity';
import { Repository } from 'typeorm';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { TransactionType } from './entities/expense-transaction.entity';
import { createMockUserGroup } from '../../test/helpers/createMockUserGroup';
import { createMockUser } from '../../test/helpers/createMockUser';

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
            findOne: jest.fn(),
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
        createExpenseTransactions: [
          {
            isAutoSplit: true,
            type: TransactionType.PAYEE,
            userId: 'user1',
          },
          {
            isAutoSplit: true,
            type: TransactionType.PAYER,
            userId: 'user1',
          },
        ],
      } satisfies CreateExpenseDto;
      const group = {
        id: groupId,
        name: 'Test Group',
        userGroups: [
          createMockUserGroup({
            userId: 'user1',
            user: createMockUser({ id: 'user1' }),
          }),
        ],
      } as Group;

      jest.spyOn(groupRepository, 'findOne').mockResolvedValue(group);
      jest
        .spyOn(expenseRepository, 'save')
        .mockImplementationOnce((expense: Expense) => Promise.resolve(expense));

      const result = await service.create(groupId, createExpenseDto);

      expect(result).toEqual(
        expect.objectContaining({
          name: createExpenseDto.name,
          amount: createExpenseDto.amount,
          incurredOn: createExpenseDto.incurredOn,
          group: group,
        } as Expense),
      );
    });

    it('should throw an error if group not found', async () => {
      const groupId = 'invalid-group-id';
      const createExpenseDto = {
        name: 'Test Expense',
        amount: 100,
        incurredOn: new Date(),
        createExpenseTransactions: [
          {
            isAutoSplit: true,
            type: TransactionType.PAYEE,
            userId: 'user1',
          },
          {
            isAutoSplit: true,
            type: TransactionType.PAYER,
            userId: 'user1',
          },
        ],
      } satisfies CreateExpenseDto;
      jest.spyOn(groupRepository, 'findOne').mockResolvedValue(null);

      await expect(service.create(groupId, createExpenseDto)).rejects.toThrow(
        'Group not found',
      );
    });
  });

  // Additional tests for findAll, findOne, update, and remove would follow a similar structure
});
