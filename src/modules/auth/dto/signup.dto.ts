import { OmitType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../users/dto/create-user.dto';

export class SignUpDto extends OmitType(CreateUserDto, ['role'] as const) {}
