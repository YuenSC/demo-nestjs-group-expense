import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { GroupsService } from './modules/groups/groups.service';
import { UserRole, UserStatus } from './modules/users/entities/user.entity';
import { UsersService } from './modules/users/users.service';

@Injectable()
export class AppService {
  constructor(
    private readonly usersService: UsersService,
    private readonly groupsService: GroupsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async resetAll(): Promise<any> {
    if (process.env.NODE_ENV !== 'local') {
      throw new BadRequestException(
        'Reset all data is only allowed in local environment',
      );
    }

    await Promise.all([
      this.usersService.resetAll(),
      this.groupsService.resetAll(),
    ]);

    await this.usersService.create({
      email: 'c1@admin.com',
      isOnboardingCompleted: false,
      password: 'Example@001',
      role: UserRole.ADMIN,
      name: 'Calvin Admin 1',
      retypedPassword: 'Example@001',
      status: UserStatus.ACTIVE,
    });
    await this.usersService.create({
      email: 'c1@user.com',
      isOnboardingCompleted: false,
      password: 'Example@001',
      role: UserRole.USER,
      name: 'Calvin User 1',
      retypedPassword: 'Example@001',
      status: UserStatus.ACTIVE,
    });

    return { message: 'All data reset successfully' };
  }

  async showCache(): Promise<any> {
    const keys = await this.cacheManager.store.keys();
    const cacheEntries = {};

    for (const key of keys) {
      const value = await this.cacheManager.get(key);
      cacheEntries[key] = value;
    }

    return cacheEntries;
  }
}
