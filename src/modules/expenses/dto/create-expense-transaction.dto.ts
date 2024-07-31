import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Min,
  ValidateIf,
} from 'class-validator';
import { TransactionType } from '../entities/expense-transaction.entity';

export class CreateExpenseTransactionDto {
  @IsEnum(TransactionType)
  type: TransactionType;

  @ValidateIf((o) => o.isAutoSplit === false)
  @IsNumber()
  @Min(0)
  amount?: number;

  @IsBoolean()
  isAutoSplit: boolean;

  @IsString()
  userId: string;
}
