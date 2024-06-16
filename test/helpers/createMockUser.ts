import { User, UserRole } from '../../src/users/entities/user.entity';

export const createMockUser = () =>
  ({
    id: 'user1',
    createdAt: new Date(),
    deletedAt: null,
    email: 'calvin_yuen@gmail.com',
    firstName: 'Calvin',
    lastName: 'Klein',
    lastLoginAt: new Date(),
    password: 'example',
    updatedAt: new Date(),
    role: UserRole.USER,
    userGroups: [],
  }) satisfies User;
