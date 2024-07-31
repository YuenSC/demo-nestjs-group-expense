import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { OtpService } from '../otp/otp.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const usersServiceMock = {
      findOneByEmail: jest.fn() as jest.MockedFunction<
        UsersService['findOneByEmail']
      >,
      updateLastLogin: jest.fn() as jest.MockedFunction<
        UsersService['updateLastLogin']
      >,
    };

    const jwtServiceMock = {
      sign: jest.fn() as jest.MockedFunction<JwtService['sign']>,
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersServiceMock },
        { provide: JwtService, useValue: jwtServiceMock },
        {
          provide: MailService,
          useValue: {
            sendMail: jest.fn(),
          },
        },
        {
          provide: OtpService,
          useValue: {
            generateOTP: jest.fn(),
            getOtpExpireInSecond: jest.fn(),
            validateOTP: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should validate user', async () => {
    const mockUser = {
      id: '1',
      email: 'test@test.com',
      password: 'hashed_password',
    };
    const mockPassword = 'password';
    (usersService.findOneByEmail as jest.Mock).mockResolvedValue(mockUser);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const result = await authService.validateUser(mockUser.email, mockPassword);

    expect(result).toEqual(mockUser);
    expect(usersService.findOneByEmail).toHaveBeenCalledWith(mockUser.email);
    expect(bcrypt.compare).toHaveBeenCalledWith(
      mockPassword,
      mockUser.password,
    );
  });

  it('should hash password', async () => {
    const mockPassword = 'password';
    const mockHashedPassword = 'hashed_password';
    (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedPassword);

    const result = await authService.hashPassword(mockPassword);

    expect(result).toEqual(mockHashedPassword);
    expect(bcrypt.hash).toHaveBeenCalledWith(mockPassword, 10);
  });

  it('should generate access token', () => {
    const mockUser = { id: '1', email: 'test@test.com' };
    const mockToken = 'token';
    (jwtService.sign as jest.Mock).mockReturnValue(mockToken);

    const result = (authService.generateAccessToken as jest.Mock)(mockUser);

    expect(result).toEqual(mockToken);
    expect(jwtService.sign).toHaveBeenCalledWith({
      username: mockUser.email,
      sub: mockUser.id,
    });
  });
});
