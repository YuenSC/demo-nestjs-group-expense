import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from '../../pagination/pagination-filter.dto';

export class ExpensePaginationFilterDto extends PaginationFilterDto {
  @IsString()
  @IsOptional()
  searchText?: string;
}
