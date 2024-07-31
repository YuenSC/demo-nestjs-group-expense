import { PaginationService } from './pagination.service';
import { PaginationFilterDto, SortOrder } from './pagination-filter.dto';
import { Repository } from 'typeorm';
import { PaginationDto } from './pagination.dto';

describe('PaginationService', () => {
  let paginationService: PaginationService;
  let mockRepository: Partial<Repository<any>>;

  beforeEach(() => {
    mockRepository = {
      findAndCount: jest.fn().mockResolvedValue([[{}, {}], 2]), // Mocking findAndCount to return 2 items
    };
    paginationService = new PaginationService();
  });

  describe('createOrderQuery', () => {
    it('should create an order query based on the filter provided', () => {
      const filter: PaginationFilterDto = {
        page: 1,
        pageSize: 10,
        orderBy: 'name',
        sortOrder: SortOrder.ASC,
      };

      const orderQuery = (paginationService as any).createOrderQuery(filter);
      expect(orderQuery).toEqual({ name: SortOrder.ASC });
    });

    it('should default to createdAt DESC if no orderBy is provided', () => {
      const filter: PaginationFilterDto = {
        page: 1,
        pageSize: 10,
      };

      const orderQuery = (paginationService as any).createOrderQuery(filter);
      expect(orderQuery).toEqual({ createdAt: SortOrder.DESC });
    });
  });

  describe('paginate', () => {
    it('should call findAndCount with correct parameters', async () => {
      const filter: PaginationFilterDto = {
        page: 1,
        pageSize: 10,
        orderBy: 'name',
        sortOrder: SortOrder.ASC,
      };

      await (paginationService as any).paginate(
        mockRepository as Repository<any>,
        filter,
        {},
      );

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        order: { name: SortOrder.ASC },
        skip: 0,
        take: 10,
      });
    });
  });

  it('should correctly handle pagination with 15 items and 10 items per page', async () => {
    // Mock findAndCount to return 15 items when called
    mockRepository.findAndCount = jest
      .fn()
      .mockResolvedValue([Array(10).fill({}), 15]);

    const filter: PaginationFilterDto = {
      page: 1, // Requesting the first page
      pageSize: 10, // Page size is 10 items
      orderBy: 'name',
      sortOrder: SortOrder.ASC,
    };

    const result = (await (paginationService as any).paginate(
      mockRepository as Repository<any>,
      filter,
      {},
    )) as PaginationDto<any>;

    expect(result.items.length).toEqual(10);
    expect(result.meta.totalItemCount).toEqual(15);
    expect(result.meta.pageCount).toEqual(2);
    expect(result.meta.page).toEqual(1);
    expect(result.meta.hasNextPage).toEqual(true);
    expect(result.meta.hasPreviousPage).toEqual(false);
    expect(result.meta.pageSize).toEqual(10);
  });
});
