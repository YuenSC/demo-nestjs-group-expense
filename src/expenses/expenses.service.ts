import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Group } from '../groups/entities/group.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { Expense } from './entities/expense.entity';
import { PaginationService } from '../pagination/pagination.service';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';

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
    const group = await this.groupRepository.findOneBy({ id: groupId });
    if (!group) throw new BadRequestException('Group not found');

    const expense = new Expense({ ...createExpenseDto, group });
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
}
