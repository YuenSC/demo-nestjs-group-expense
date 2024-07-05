import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';

@Controller('groups/:groupId/expense')
export class ExpensesController {
  constructor(private readonly expenseService: ExpensesService) {}

  @Post()
  create(
    @Param('groupId') groupId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(groupId, createExpenseDto);
  }

  @Get()
  findAll(
    @Param('groupId') groupId: string,
    paginationFilterDto: PaginationFilterDto,
  ) {
    return this.expenseService.findAll(groupId, paginationFilterDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExpenseDto: UpdateExpenseDto) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.expenseService.remove(id);
  }
}
