import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';
import { ExpensePayer } from './expense-payer.entity';
import { ExpensePayee } from './expense-payee.entity';

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

  @OneToMany(() => ExpensePayer, (expensePayer) => expensePayer.expense, {
    eager: true,
    cascade: true,
  })
  payers: ExpensePayer[];

  @OneToMany(() => ExpensePayee, (expensePayee) => expensePayee.expense, {
    eager: true,
    cascade: true,
  })
  payees: ExpensePayee[];
}
