import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Group } from './group.entity';

@Entity()
export class GroupMember extends AbstractEntity {
  @Column()
  userId: number;

  @Column()
  groupId: number;

  @ManyToOne(() => User, (user) => user.groups)
  user: User;

  @ManyToOne(() => Group, (group) => group.members)
  group: Group;
}
