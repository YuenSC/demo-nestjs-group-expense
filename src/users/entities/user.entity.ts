import { IsEmail, IsEnum, Length } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { UserGroup } from '../../groups/entities/user-group.entity';
import { Exclude } from 'class-transformer';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  @Length(2)
  firstName: string;

  @Column()
  @Length(2)
  lastName: string;

  @Column()
  @IsEmail()
  @Index({ unique: true })
  email: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];
}
