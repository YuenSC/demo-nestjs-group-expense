import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { AuthGuardLocal } from './auth-guard.local';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { createMockUser } from '../../test/helpers/createMockUser';

describe('AuthController', () => {
  let authController: AuthController;
  let usersService: UsersService;

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
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue('3600') },
        },
        { provide: UsersService, useValue: { create: jest.fn() } },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should return user and access_token', async () => {
    const user = { id: 1, username: 'test' };
    const response = {
      cookie: jest.fn(),
    } as unknown as Response;
    const generatedToken = `mock_token_${user.id}`;

    const result = await authController.login(user, response);

    expect(result).toEqual({ user, access_token: generatedToken });
    expect(response.cookie).toHaveBeenCalledWith(
      'access_token',
      generatedToken,
      expect.any(Object),
    );
  });

  it('should create a new user', async () => {
    const signUpDto = {
      email: '',
      password: '',
      name: '',
      retypedPassword: '',
    } satisfies SignUpDto;

    const response = {
      cookie: jest.fn(),
    } as unknown as Response;

    jest.spyOn(usersService, 'create').mockResolvedValue(createMockUser());

    await authController.signUp(signUpDto, response);

    expect(usersService.create).toHaveBeenCalledWith({
      ...signUpDto,
      role: 'user',
    });
  });
});
