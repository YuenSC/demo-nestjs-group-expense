import { CacheOptions } from '@nestjs/cache-manager';
import { registerAs } from '@nestjs/config';

const config = {
  max: 1000,
  ttl: 300000,
} satisfies CacheOptions;

export default registerAs('cache', (): CacheOptions => config);
