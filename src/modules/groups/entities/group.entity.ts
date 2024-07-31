import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../common/base.entity';
import { Expense } from '../../expenses/entities/expense.entity';
import { UserGroup } from './user-group.entity';

@Entity()
export class Group extends BaseEntity<Group> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: false })
  createdBy: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @OneToMany(() => Expense, (expense) => expense.group)
  expenses: Expense[];
}
