import { MailerModule } from '@nestjs-modules/mailer';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import authJwtConfig from './config/auth-jwt.config';
import cacheConfig from './config/cache.config';
import databaseConfig from './config/database.config';
import envFilePath from './config/envFilePath';
import mailerConfig from './config/mailer.config';
import s3Config from './config/s3.config';
import { ExpensesModule } from './expenses/expenses.module';
import { FileUploadModule } from './file-upload/file-upload.module';
import { GroupsModule } from './groups/groups.module';
import { MailModule } from './mail/mail.module';
import { MailService } from './mail/mail.service';
import { OtpModule } from './otp/otp.module';
import { TransformInterceptor } from './transform.interceptor';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, authJwtConfig, s3Config],
      envFilePath: envFilePath,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: cacheConfig,
    }),
    MailerModule.forRootAsync({
      useFactory: mailerConfig,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: databaseConfig,
    }),
    UsersModule,
    AuthModule,
    GroupsModule,
    FileUploadModule,
    ExpensesModule,
    MailModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    MailService,
    {
      provide: APP_INTERCEPTOR,
      useClass: CacheInterceptor,
    },
  ],
})
export class AppModule {}
