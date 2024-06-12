import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config as dotenvConfig } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import envFilePath from './envFilePath';

dotenvConfig({ path: envFilePath });

const config = {
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
  migrationsRun: true,
  autoLoadEntities: true,
  synchronize: !process.env.NODE_ENV,
} satisfies TypeOrmModuleOptions;

export default registerAs('database', (): TypeOrmModuleOptions => config);
export const connectionSource = new DataSource(config as DataSourceOptions);
