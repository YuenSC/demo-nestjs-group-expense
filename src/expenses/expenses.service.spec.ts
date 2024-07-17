import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Group } from '../groups/entities/group.entity';
import { Expense } from './entities/expense.entity';
import { ExpensesService } from './expenses.service';

describe('ExpensesService', () => {
  let service: ExpensesService;
  // let expenseRepository: Repository<Expense>;
  // let groupRepository: Repository<Group>;

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
    // expenseRepository = module.get<Repository<Expense>>(
    //   getRepositoryToken(Expense),
    // );
    // groupRepository = module.get<Repository<Group>>(getRepositoryToken(Group));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('create', () => {
  //   it('should successfully create an expense', async () => {
  //     const groupId = 'test-group-id';
  //     const createExpenseDto = {
  //       description: 'Test Expense',
  //       amount: 100,
  //       incurredOn: new Date(),
  //       currencyCode: 'USD',
  //       createExpenseTransactions: [
  //         {
  //           isAutoSplit: true,
  //           type: TransactionType.PAYEE,
  //           userId: 'user1',
  //         },
  //         {
  //           isAutoSplit: true,
  //           type: TransactionType.PAYER,
  //           userId: 'user1',
  //         },
  //       ],
  //     } satisfies CreateExpenseDto;
  //     const group = createMockGroup({
  //       userGroups: [
  //         createMockUserGroup({
  //           userId: 'user1',
  //           user: createMockUser({ id: 'user1' }),
  //         }),
  //       ],
  //     });

  //     jest.spyOn(groupRepository, 'findOne').mockResolvedValue(group);
  //     jest
  //       .spyOn(expenseRepository, 'save')
  //       .mockImplementationOnce((expense: Expense) => Promise.resolve(expense));

  //     const result = await service.create(groupId, createExpenseDto);

  //     expect(result).toEqual(
  //       expect.objectContaining({
  //         id: expect.any(String),
  //         description: createExpenseDto.description,
  //         currencyCode: createExpenseDto.currencyCode,
  //         amount: createExpenseDto.amount,
  //         incurredOn: createExpenseDto.incurredOn,
  //         group: group,
  //         transactions: expect.any(Array),
  //       }),
  //     );
  //   });

  //   it('should throw an error if group not found', async () => {
  //     const groupId = 'invalid-group-id';
  //     const createExpenseDto = {
  //       description: 'Test Expense',
  //       amount: 100,
  //       incurredOn: new Date(),
  //       currencyCode: 'USD',
  //       createExpenseTransactions: [
  //         {
  //           isAutoSplit: true,
  //           type: TransactionType.PAYEE,
  //           userId: 'user1',
  //         },
  //         {
  //           isAutoSplit: true,
  //           type: TransactionType.PAYER,
  //           userId: 'user1',
  //         },
  //       ],
  //     } satisfies CreateExpenseDto;
  //     jest.spyOn(groupRepository, 'findOne').mockResolvedValue(null);

  //     await expect(service.create(groupId, createExpenseDto)).rejects.toThrow(
  //       'Group not found',
  //     );
  //   });
  // });

  // Additional tests for findAll, findOne, update, and remove would follow a similar structure
});
