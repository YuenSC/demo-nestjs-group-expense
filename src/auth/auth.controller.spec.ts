import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthGuardLocal } from './auth-guard.local';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

describe('AuthController', () => {
  let authController: AuthController;
  let configService: ConfigService;

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
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should return user and access_token', async () => {
    const user = { id: 1, username: 'test' };
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;
    const generatedToken = `mock_token_${user.id}`;

    jest.spyOn(configService, 'get').mockReturnValue('3600');

    const result = await authController.login(user, response);

    expect(result).toEqual({ user, access_token: generatedToken });
    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      generatedToken,
      expect.any(Object),
    );
  });
});
