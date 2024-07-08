import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Expense } from './expense.entity';

@Entity()
export class ExpensePayee extends BaseEntity<ExpensePayee> {
  @ManyToOne(() => Expense, (expense) => expense.payees)
  expense: Expense;

  @ManyToOne(() => User, (user) => user.payees)
  user: User;

  @Column()
  amountOwed: number;

  @Column({ default: false })
  isAutoSplit: boolean;
}
