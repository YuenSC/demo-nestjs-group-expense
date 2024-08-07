import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UUIDParam } from '../../common/decorators/uuid-param.decorator';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { ExpensePaginationFilterDto } from './dto/expense-pagination-filter.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
@UseGuards(AuthGuardJwt)
@Controller('groups/:groupId')
export class ExpensesController {
  constructor(private readonly expenseService: ExpensesService) {}

  @Post('expenses')
  create(
    @UUIDParam('groupId') groupId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(groupId, createExpenseDto);
  }

  @Get('expenses/unresolved-amount-per-currency')
  getUnresolvedAmountPerCurrency(
    @UUIDParam('groupId') groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.expenseService.getUnresolvedAmountPerCurrency(groupId, user.id);
  }

  @Get('expenses/payment-relationship')
  getPaymentRelationship(@UUIDParam('groupId') groupId: string) {
    return this.expenseService.getPaymentRelationship(groupId);
  }

  @Get('expenses')
  findAll(
    @UUIDParam('groupId') groupId: string,
    @Query() paginationFilterDto: ExpensePaginationFilterDto,
  ) {
    return this.expenseService.findAll(groupId, paginationFilterDto);
  }

  @Get('statistics')
  getStatistics(
    @UUIDParam('groupId') groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.expenseService.getStatistics(groupId, user.id);
  }

  @Get('expenses/:id')
  findOne(@UUIDParam('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch('expenses/:id')
  update(
    @UUIDParam('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete('expenses/:id')
  remove(@UUIDParam('id') id: string) {
    return this.expenseService.remove(id);
  }
}
