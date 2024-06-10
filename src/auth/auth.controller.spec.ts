import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuardLocal } from './auth-guard.local';

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const authServiceMock = {
      generateAccessToken: jest
        .fn()
        .mockImplementation((user) => `mock_token_${user.id}`),
    };

    const AuthGuardLocalMock = jest.fn().mockImplementation(() => ({
      canActivate: jest.fn().mockReturnValue(true),
    }));

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: AuthGuardLocal, useValue: AuthGuardLocalMock },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should return user and access token', async () => {
    const mockUser = { id: '1', username: 'test' };
    const result = await authController.login(mockUser);
    expect(result).toEqual({
      user: mockUser,
      access_token: 'mock_token_1',
    });
    expect(authService.generateAccessToken).toHaveBeenCalledWith(mockUser);
  });
});
