import { IsArray, IsBoolean, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class User {
  @IsString()
  id: string;

  @IsBoolean()
  isAdmin: boolean;
}

export class AddUserDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => User)
  users: User[];
}
