import { FindOptionsWhere, Repository } from 'typeorm';
import { PaginationFilterDto, SortOrder } from './pagination-filter.dto';
import { PaginationDto } from './pagination.dto';
import { PaginationMetaDto } from './prgination-meta.dto';

export class PaginationService {
  protected createOrderQuery(filter: PaginationFilterDto) {
    const order: any = {};

    if (filter.orderBy) {
      order[filter.orderBy] = filter.sortOrder;
      return order;
    }

    order.createdAt = filter.sortOrder || SortOrder.DESC;
    return order;
  }

  protected async paginate<T>(
    repository: Repository<T>,
    paginationFilterDto: PaginationFilterDto,
    where: FindOptionsWhere<T>,
  ): Promise<PaginationDto<T>> {
    const [items, totalItemCount] = await repository.findAndCount({
      order: this.createOrderQuery(paginationFilterDto),
      skip: (paginationFilterDto.page - 1) * (paginationFilterDto.pageSize + 1),
      take: paginationFilterDto.pageSize,
      where: where,
    });

    return {
      items,
      meta: new PaginationMetaDto({
        totalItemCount,
        paginationFilterDto,
      }),
    };
  }
}
