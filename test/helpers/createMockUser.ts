import {
  User,
  UserRole,
  UserStatus,
} from '../../src/users/entities/user.entity';

export const createMockUser = (defaultUser?: Partial<User>) =>
  ({
    id: 'user1',
    createdAt: new Date(),
    deletedAt: null,
    email: 'calvin_yuen@gmail.com',
    name: 'Calvin',
    lastLoginAt: new Date(),
    password: 'example',
    updatedAt: new Date(),
    role: UserRole.USER,
    userGroups: [],
    isOnboardingCompleted: false,
    imageKey: 'image_key',
    imageUrl: 'image_url',
    transactions: [],
    status: UserStatus.ACTIVE,
    otpSecret: 'otp_secret',
    ...defaultUser,
  }) satisfies User;
