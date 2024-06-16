import { IsArray } from 'class-validator';
import { PaginationMetaDto } from './prgination-meta.dto';

export class PaginationDto<T> {
  @IsArray()
  readonly data: T[];

  readonly meta: PaginationMetaDto;

  constructor(data: T[], meta: PaginationMetaDto) {
    this.data = data;
    this.meta = meta;
  }
}
