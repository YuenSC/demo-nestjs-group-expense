import { IsString, Length } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  @Length(2, 100)
  name: string;

  @IsString()
  @Length(0, 100)
  description: string;
}
