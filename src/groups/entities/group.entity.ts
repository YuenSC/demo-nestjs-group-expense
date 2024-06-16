import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { UserGroup } from './user-group.entity';

@Entity()
export class Group extends BaseEntity<Group> {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];

  @Column({ nullable: false })
  createdBy: string;
}
