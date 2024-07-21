import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Group } from '../groups/entities/group.entity';
import { PaginationService } from '../pagination/pagination.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpensePaginationFilterDto } from './dto/expense-pagination-filter.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpenseTransaction } from './entities/expense-transaction.entity';
import { Expense } from './entities/expense.entity';
import { calculateUserNetTransactionAmount } from './utils/calculateUserNetTransactionAmount';
import { generatePaymentRelationshipForOneCurrencyCode } from './utils/generatePaymentRelationshipForOneCurrencyCode';
import { validateTransactionsWithAutoSplit } from './utils/validateTransactionsWithAutoSplit';

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

  async findAll(
    groupId: string,
    paginationFilterDto: ExpensePaginationFilterDto,
  ) {
    const { searchText } = paginationFilterDto;

    return await this.paginate(this.expenseRepository, paginationFilterDto, {
      where: searchText
        ? {
            group: { id: groupId },
            description: Like(`%${searchText.trim()}%`),
          }
        : { group: { id: groupId } },
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
        const { netAmount, currencyCode } = calculateUserNetTransactionAmount(
          expense,
          userId,
        );
        return {
          ...acc,
          [expense.currencyCode]: (acc[currencyCode] ?? 0) + netAmount,
        };
      },
      {} as Record<string, number>,
    );
  }

  async getPaymentRelationship(groupId: string) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['userGroups', 'userGroups.user'],
    });

    if (!group) throw new BadRequestException('Group not found');

    const expenses = await this.expenseRepository.find({
      where: { group: { id: groupId } },
      relations: ['transactions', 'transactions.user'],
    });

    const expenseByCurrency = expenses.reduce(
      (acc, expense) => ({
        ...acc,
        [expense.currencyCode]: [...(acc[expense.currencyCode] ?? []), expense],
      }),
      {} as Record<string, Expense[]>,
    );

    const users = group.userGroups.map((userGroup) => userGroup.user);

    const paymentRelationship = Object.fromEntries(
      Object.entries(expenseByCurrency)
        .map(([currencyCode, expenses]) => [
          currencyCode,
          generatePaymentRelationshipForOneCurrencyCode(expenses, users),
        ])
        .filter(([, relationships]) => relationships.length > 0),
    );
    return paymentRelationship;
  }
}
