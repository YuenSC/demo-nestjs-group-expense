import { Expose } from 'class-transformer';
import { BaseEntity } from '../../common/base.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity()
export class Group extends BaseEntity<Group> {
  @Column()
  @Expose()
  name: string;

  @Column({ nullable: true })
  @Expose()
  description: string;

  @OneToMany(() => UserGroup, (userGroup) => userGroup.group)
  userGroups: UserGroup[];
}
