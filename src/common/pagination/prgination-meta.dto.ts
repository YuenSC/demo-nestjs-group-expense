import { PaginationFilterDto } from './pagination-filter.dto';

export interface PaginationMetaDtoParameters {
  paginationFilterDto: PaginationFilterDto;
  totalItemCount: number;
}

export class PaginationMetaDto {
  page: number;

  pageSize: number;

  totalItemCount: number;

  pageCount: number;

  hasPreviousPage: boolean;

  hasNextPage: boolean;

  constructor({
    paginationFilterDto,
    totalItemCount,
  }: PaginationMetaDtoParameters) {
    this.page = paginationFilterDto.page;
    this.pageSize = paginationFilterDto.pageSize;
    this.totalItemCount = totalItemCount;
    this.pageCount = Math.ceil(this.totalItemCount / this.pageSize);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
