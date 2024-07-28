import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';
import { ExpenseTransaction } from './expense-transaction.entity';
import { ColumnNumericTransformer } from '../../common/column-numeric.transformer';

@Entity()
export class Expense extends BaseEntity<Expense> {
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer(),
  })
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
