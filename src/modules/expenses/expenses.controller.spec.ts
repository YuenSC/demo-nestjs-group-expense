import { Test, TestingModule } from '@nestjs/testing';
import { ExpensesController } from './expenses.controller';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PaginationFilterDto } from '../../common/pagination/pagination-filter.dto';

describe('ExpensesController', () => {
  let controller: ExpensesController;
  let service: ExpensesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpensesController],
      providers: [
        {
          provide: ExpensesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ExpensesController>(ExpensesController);
    service = module.get<ExpensesService>(ExpensesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call expenseService.create with the correct parameters', async () => {
      const groupId = 'test-group-id';
      const createExpenseDto = new CreateExpenseDto();
      jest.spyOn(service, 'create').mockResolvedValue('mockExpense' as any);
      await controller.create(groupId, createExpenseDto);
      expect(service.create).toHaveBeenCalledWith(groupId, createExpenseDto);
    });
  });

  describe('findAll', () => {
    it('should call expenseService.findAll with the correct parameters', async () => {
      const groupId = 'test-group-id';
      const paginationFilterDto = new PaginationFilterDto();
      jest.spyOn(service, 'findAll').mockResolvedValue('mockExpenses' as any);
      await controller.findAll(groupId, paginationFilterDto);
      expect(service.findAll).toHaveBeenCalledWith(
        groupId,
        paginationFilterDto,
      );
    });
  });

  describe('findOne', () => {
    it('should call expenseService.findOne with the correct parameters', async () => {
      const id = 'test-id';
      jest.spyOn(service, 'findOne').mockResolvedValue('mockExpense' as any);
      await controller.findOne(id);
      expect(service.findOne).toHaveBeenCalledWith(id);
    });
  });

  describe('update', () => {
    it('should call expenseService.update with the correct parameters', async () => {
      const id = 'test-id';
      const updateExpenseDto = new UpdateExpenseDto();
      jest
        .spyOn(service, 'update')
        .mockResolvedValue('mockUpdatedExpense' as any);
      await controller.update(id, updateExpenseDto);
      expect(service.update).toHaveBeenCalledWith(id, updateExpenseDto);
    });
  });

  describe('remove', () => {
    it('should call expenseService.remove with the correct parameters', async () => {
      const id = 'test-id';
      jest.spyOn(service, 'remove').mockResolvedValue('mockRemovedExpense');
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
