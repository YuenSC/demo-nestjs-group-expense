import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';
import { ExpenseTransaction } from './expense-transaction.entity';

@Entity()
export class Expense extends BaseEntity<Expense> {
  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  incurredOn: Date;

  @ManyToOne(() => Group, (group) => group.expenses)
  group: Group;

  @OneToMany(
    () => ExpenseTransaction,
    (expenseTransaction) => expenseTransaction.expense,
    {
      eager: true,
      cascade: true,
    },
  )
  transactions: ExpenseTransaction[];
}
