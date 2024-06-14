import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, Length } from 'class-validator';
import { UserGroup } from '../../groups/entities/user-group.entity';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class User extends BaseEntity<User> {
  @Column()
  @Expose()
  @Length(2)
  firstName: string;

  @Column()
  @Expose()
  @Length(2)
  lastName: string;

  @Column()
  @Expose()
  @IsEmail()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @Expose()
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ nullable: true })
  @Expose()
  lastLoginAt: Date;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];
}
