import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
/**
 * Test the UsersService
 * 1. All User Api can only be called by the admin
 * 2. Duplicate email should not be allowed
 * 3. Password related fields should not be returned in the response
 * 4. After user is deleted, the user should not be able to login (test in auth???)
 */
describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
