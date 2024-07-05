import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { Group } from '../../groups/entities/group.entity';

@Entity()
export class Expense extends BaseEntity<Expense> {
  @Column()
  name: string;

  @Column()
  amount: number;

  @Column()
  incurredOn: Date;

  @ManyToOne(() => Group, (group) => group.expenses, { cascade: true })
  group: Group;
}
