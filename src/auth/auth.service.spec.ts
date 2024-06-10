import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';

/**
 * Test the AuthService
 * 1. Sign Up Api can only be called by user in the app
 */
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
