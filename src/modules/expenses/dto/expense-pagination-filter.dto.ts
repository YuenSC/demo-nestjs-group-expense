import { IsOptional, IsString } from 'class-validator';
import { PaginationFilterDto } from '../../../common/pagination/pagination-filter.dto';

export class ExpensePaginationFilterDto extends PaginationFilterDto {
  @IsString()
  @IsOptional()
  searchText?: string;
}
