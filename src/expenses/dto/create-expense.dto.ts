import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsDateString,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateExpenseTransactionDto } from './create-expense-transaction.dto';

export class CreateExpenseDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  incurredOn: Date;

  @ValidateNested({ each: true })
  @Type(() => CreateExpenseTransactionDto)
  @ArrayNotEmpty()
  createExpenseTransactions: CreateExpenseTransactionDto[];

  @IsString()
  currencyCode: string;

  @IsString()
  description: string;

  @IsString()
  category: string;
}
