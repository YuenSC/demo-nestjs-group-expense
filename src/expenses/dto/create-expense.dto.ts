import {
  ArrayNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExpenseTransactionDto } from './create-expense-transaction.dto';

export class CreateExpenseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  incurredOn: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateExpenseTransactionDto)
  @ArrayNotEmpty()
  createExpenseTransactions: CreateExpenseTransactionDto[];
}
