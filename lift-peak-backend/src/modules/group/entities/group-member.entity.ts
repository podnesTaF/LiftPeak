import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Group } from './group.entity';

export enum MemberRole {
  ADMIN = 'admin',
  MEMBER = 'member',
}

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

  @Column({
    type: 'enum',
    enum: MemberRole,
    default: MemberRole.MEMBER,
  })
  role: MemberRole;
}
