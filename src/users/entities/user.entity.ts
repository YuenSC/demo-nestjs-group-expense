import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { ExpenseTransaction } from '../../expenses/entities/expense-transaction.entity';
import { UserGroup } from '../../groups/entities/user-group.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity()
export class User extends BaseEntity<User> {
  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  @IsEmail()
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  isOnboardingCompleted: boolean;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  imageKey: string;

  imageUrl: string; //generate dynamically from aws signed url

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @OneToMany(
    () => ExpenseTransaction,
    (expenseTransaction) => expenseTransaction.user,
  )
  transactions: ExpenseTransaction[];

  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.INACTIVE,
  })
  status: UserStatus;

  @Column({ nullable: true })
  @Exclude({ toPlainOnly: true })
  otpSecret: string;
}
