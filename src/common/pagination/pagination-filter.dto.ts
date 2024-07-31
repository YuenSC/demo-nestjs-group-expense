import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

// Define a helper function to convert a value to a number with default and min constraints
function toNumber(
  value: string,
  options: { default: number; min: number },
): number {
  let num = parseInt(value, 10);
  if (isNaN(num) || num < options.min) {
    num = options.default;
  }
  return num;
}

export class PaginationFilterDto {
  @Transform(({ value }) => toNumber(value, { default: 1, min: 1 }))
  @IsNumber()
  @IsOptional()
  public page: number = 1;

  @Transform(({ value }) => toNumber(value, { default: 10, min: 1 }))
  @IsNumber()
  @IsOptional()
  public pageSize: number = 10;

  @IsOptional()
  public orderBy?: string;

  @IsEnum(SortOrder)
  @IsOptional()
  public sortOrder?: SortOrder = SortOrder.DESC;
}
