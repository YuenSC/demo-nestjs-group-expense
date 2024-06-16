import { Group } from '../../src/groups/entities/group.entity';
import { UserGroup } from '../../src/groups/entities/user-group.entity';
import { createMockUser } from './createMockUser';

const mockGroup = {
  createdAt: new Date(),
  createdBy: 'user1',
  deletedAt: null,
  description: 'test group',
  id: 'test-group-id',
  name: 'Test Group',
  updatedAt: new Date(),
  userGroups: [],
} satisfies Group;

export const createMockUserGroup = (options?: Partial<UserGroup>) =>
  ({
    id: 'user-group',
    createdAt: new Date(),
    deletedAt: null,
    group: mockGroup,
    isAdmin: true,
    groupId: 'test-group-id',
    updatedAt: new Date(),
    user: createMockUser(),
    userId: 'user1',
    ...options,
  }) satisfies UserGroup;
