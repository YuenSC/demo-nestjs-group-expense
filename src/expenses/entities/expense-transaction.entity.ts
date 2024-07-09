import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Expense } from './expense.entity';

export enum TransactionType {
  PAYER = 'payer',
  PAYEE = 'payee',
}

@Entity()
export class ExpenseTransaction extends BaseEntity<ExpenseTransaction> {
  constructor(partial: Partial<ExpenseTransaction>) {
    super(partial);
    if (this.isAutoSplit) {
      this.amount = null;
    }
  }

  @Column({
    type: 'enum',
    enum: TransactionType,
    default: TransactionType.PAYEE,
  })
  type: TransactionType;

  @Column({
    nullable: true,
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number | null;

  @Column({ default: false })
  isAutoSplit: boolean;

  @ManyToOne(() => Expense, (expense) => expense.transactions, {
    onDelete: 'CASCADE',
  })
  expense: Expense;

  @ManyToOne(() => User, (user) => user.transactions)
  @JoinColumn({ name: 'userId' }) // This specifies the column used for joining.
  user: User;

  @Column()
  userId: string;
}
