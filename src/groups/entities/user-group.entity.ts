import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { BaseEntity } from '../../common/base.entity';
import { User } from '../../users/entities/user.entity';
import { Group } from './group.entity';

@Entity()
@Unique(['userId', 'groupId'])
export class UserGroup extends BaseEntity<UserGroup> {
  @ManyToOne(() => User, (user) => user.userGroups)
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  group: Group;

  @Column({ default: false })
  isAdmin: boolean;

  @Column()
  userId: string;

  @Column()
  groupId: string;
}
