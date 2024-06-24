import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
  Length,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { Transform } from 'class-transformer';

export class CreateUserDto {
  @IsString()
  @Length(2)
  name: string;

  @IsEmail()
  @IsOptional()
  email: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;

  @IsOptional()
  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  retypedPassword: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true') // Convert string to boolean due to the usage of form-data
  isOnboardingCompleted: boolean;
}
