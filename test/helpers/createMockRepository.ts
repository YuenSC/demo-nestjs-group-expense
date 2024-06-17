import { Repository } from 'typeorm';

export type MockRepository<T = any> = Partial<
  Record<keyof Repository<T>, jest.Mock>
> & {
  manager: jest.Mock & {
    transaction: jest.Mock;
  };
};

export const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOneBy: jest.fn(),
  findAndCount: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  manager: Object.assign(jest.fn(), {
    transaction: jest.fn().mockImplementation(async (callback) => {
      const mockEntityManager = {
        save: jest.fn().mockImplementation((entity) => entity),
      };
      return callback(mockEntityManager);
    }),
  }),
});
