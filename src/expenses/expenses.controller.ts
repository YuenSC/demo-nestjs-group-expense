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
import { UUIDParam } from '../decorators/uuid-param.decorator';
import { PaginationFilterDto } from '../pagination/pagination-filter.dto';
import { CreateExpenseDto } from './dto/create-expense.dto';
import { UpdateExpenseDto } from './dto/update-expense.dto';
import { ExpensesService } from './expenses.service';
import { CurrentUser } from '../auth/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthGuardJwt } from '../auth/auth-guard.jwt';
@UseGuards(AuthGuardJwt)
@Controller('groups/:groupId/expenses')
export class ExpensesController {
  constructor(private readonly expenseService: ExpensesService) {}

  @Post()
  create(
    @UUIDParam('groupId') groupId: string,
    @Body() createExpenseDto: CreateExpenseDto,
  ) {
    return this.expenseService.create(groupId, createExpenseDto);
  }

  @Get('unresolved-amount-per-currency')
  getUnresolvedAmountPerCurrency(
    @UUIDParam('groupId') groupId: string,
    @CurrentUser() user: User,
  ) {
    return this.expenseService.getUnresolvedAmountPerCurrency(groupId, user.id);
  }

  @Get('payment-relationship')
  getPaymentRelationship(@UUIDParam('groupId') groupId: string) {
    return this.expenseService.getPaymentRelationship(groupId);
  }

  @Get()
  findAll(
    @UUIDParam('groupId') groupId: string,
    @Query() paginationFilterDto: PaginationFilterDto,
  ) {
    return this.expenseService.findAll(groupId, paginationFilterDto);
  }

  @Get(':id')
  findOne(@UUIDParam('id') id: string) {
    return this.expenseService.findOne(id);
  }

  @Patch(':id')
  update(
    @UUIDParam('id') id: string,
    @Body() updateExpenseDto: UpdateExpenseDto,
  ) {
    return this.expenseService.update(id, updateExpenseDto);
  }

  @Delete(':id')
  remove(@UUIDParam('id') id: string) {
    return this.expenseService.remove(id);
  }
}
