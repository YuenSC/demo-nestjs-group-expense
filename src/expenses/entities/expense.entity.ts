import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';
import { ExpenseTransaction } from './expense-transaction.entity';

@Entity()
export class Expense extends BaseEntity<Expense> {
  @Column()
  amount: number;

  @Column()
  description: string;

  @Column()
  currencyCode: string;

  @Column()
  incurredOn: Date;

  @ManyToOne(() => Group, (group) => group.expenses, { onDelete: 'CASCADE' })
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
