import { IsEmail, IsEnum, IsStrongPassword, Length } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @Length(2)
  username: string;

  @Length(2)
  firstName: string;

  @Length(2)
  lastName: string;

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 8,
    minSymbols: 1,
    minNumbers: 1,
    minUppercase: 1,
    minLowercase: 1,
  })
  password: string;

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
}
