import { IsDateString, IsNumber, IsString, Min } from 'class-validator';

export class CreateExpenseDto {
  @IsString()
  name: string;

  @IsNumber()
  @Min(0)
  amount: number;

  @IsDateString()
  incurredOn: Date;
}
