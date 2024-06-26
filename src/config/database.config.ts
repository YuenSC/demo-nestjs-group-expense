import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import envFilePath from './envFilePath';

dotenvConfig({ path: envFilePath });

const config = {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: !(process.env.NODE_ENV === 'local'),
  autoLoadEntities: true,
  synchronize: process.env.NODE_ENV === 'local',
} satisfies TypeOrmModuleOptions;

export default registerAs('database', (): TypeOrmModuleOptions => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
