import { Exclude } from 'class-transformer';
import { IsEmail, IsEnum } from 'class-validator';
import { Column, Entity, Index, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { UserGroup } from '../../groups/entities/user-group.entity';
import { ExpensePayer } from '../../expenses/entities/expense-payer.entity';
import { ExpensePayee } from '../../expenses/entities/expense-payee.entity';

export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
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

  imageUrl: string;

  @Column({ nullable: true })
  lastLoginAt: Date;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @OneToMany(() => ExpensePayer, (expensePayer) => expensePayer.user)
  payers: ExpensePayer[];

  @OneToMany(() => ExpensePayee, (expensePayee) => expensePayee.user)
  payees: ExpensePayee[];
}
