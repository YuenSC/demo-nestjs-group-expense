import { IsArray } from 'class-validator';
import { PaginationMetaDto } from './prgination-meta.dto';

export class PaginationDto<T> {
  @IsArray()
  readonly items: T[];

  readonly meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.items = data;
    this.meta = meta;
  }
}
