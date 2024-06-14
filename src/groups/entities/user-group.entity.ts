import { User } from '../../users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @ManyToOne(() => User, (user) => user.userGroups)
  user: User;

  @ManyToOne(() => Group, (group) => group.userGroups)
  group: Group;

  @Column({ default: false })
  isAdmin: boolean;
}
