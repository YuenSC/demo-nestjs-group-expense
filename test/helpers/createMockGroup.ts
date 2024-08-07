import { Group } from '../../src/modules/groups/entities/group.entity';

export const createMockGroup = (defaultGroup?: Partial<Group>) =>
  ({
    id: 'user1',
    createdAt: new Date(),
    deletedAt: null,
    updatedAt: new Date(),
    userGroups: [],
    name: 'Test Group',
    createdBy: 'user1',
    description: 'test group',
    expenses: [],
    ...defaultGroup,
  }) satisfies Group;
