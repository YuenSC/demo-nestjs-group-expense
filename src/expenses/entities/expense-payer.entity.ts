import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Expense } from './expense.entity';

@Entity()
export class ExpensePayer extends BaseEntity<ExpensePayer> {
  @ManyToOne(() => Expense, (expense) => expense.payers)
  expense: Expense;

  @ManyToOne(() => User, (user) => user.payers)
  user: User;

  @Column()
  amountPaid: number;

  @Column({ default: false })
  isAutoSplit: boolean;
}
