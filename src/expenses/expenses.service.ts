import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../groups/entities/group.entity';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';
import { PaginationService } from '../pagination/pagination.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseTransaction } from './entities/expense-transaction.entity';
import { Expense } from './entities/expense.entity';
import { validateTransactionsWithAutoSplit } from './utils/validateTransactionsWithAutoSplit';
import { getUnresolvedAmountFromExpense } from './utils/getUnresolvedAmountFromExpense';

@Injectable()
export class ExpensesService extends PaginationService {
  constructor(
    @InjectRepository(Group)
    private groupRepository: Repository<Group>,

    @InjectRepository(Expense)
    private expenseRepository: Repository<Expense>,
  ) {
    super();
  }

  async create(groupId: string, createExpenseDto: CreateExpenseDto) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['userGroups', 'userGroups.user'],
    });
    if (!group) throw new BadRequestException('Group not found');

    const { createExpenseTransactions, ...rest } = createExpenseDto;
    const transactions = createExpenseTransactions.map(
      ({ userId, ...transaction }) => {
        const userGroup = group.userGroups.find(
          (userGroup) => userGroup.user.id === userId,
        );
        if (!userGroup) throw new BadRequestException(`Invalid User Id`);
        return new ExpenseTransaction({ ...transaction, user: userGroup.user });
      },
    );

    try {
      validateTransactionsWithAutoSplit(createExpenseDto.amount, transactions);
    } catch (error) {
      throw new BadRequestException(error.message);
    }

    const expense = new Expense({ ...rest, group, transactions });
    return await this.expenseRepository.save(expense);
  }

  async findAll(groupId: string, paginationFilterDto: PaginationFilterDto) {
    return await this.paginate(this.expenseRepository, paginationFilterDto, {
      where: { group: { id: groupId } },
    });
  }

  async findOne(id: string) {
    return await this.expenseRepository.findOneByOrFail({ id });
  }

  async update(id: string, updateExpenseDto: UpdateExpenseDto) {
    const expense = await this.expenseRepository.findOneBy({ id });
    if (!expense) throw new BadRequestException('Expense not found');

    const updatedExpense = new Expense({ ...expense, ...updateExpenseDto });
    return await this.expenseRepository.save(updatedExpense);
  }

  async remove(id: string) {
    const { affected } = await this.expenseRepository.delete(id);
    if (affected === 0) {
      throw new BadRequestException('Expenses not found');
    }
    return `Expense with id ${id} has been deleted`;
  }

  async getUnresolvedAmountPerCurrency(groupId: string, userId: string) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['userGroups', 'userGroups.user'],
    });

    if (!group) throw new BadRequestException('Group not found');

    const expenses = await this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['transactions', 'transactions.user'],
    });

    return expenses.reduce(
      (acc, expense) => {
        const unresolvedAmount = getUnresolvedAmountFromExpense(
          expense,
          userId,
        );
        return {
          ...acc,
          [expense.currencyCode]:
            (acc[expense.currencyCode] ?? 0) + unresolvedAmount,
        };
      },
      {} as Record<string, number>,
    );
  }
}
