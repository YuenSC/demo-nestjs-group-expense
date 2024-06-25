import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class CreateGroupUserDto extends OmitType(CreateUserDto, [
  'role',
] as const) {
  isAdmin: boolean;
}
