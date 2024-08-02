import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { GroupMember } from './group-member.entity';

@Entity()
export class Group extends AbstractEntity {
  @Column()
  name: string;

  @Column({
    nullable: true,
  })
  description: string;

  @Column({
    nullable: true,
  })
  pictureUrl: string;

  @Column({
    nullable: true,
  })
  wallPictureUrl: string;

  @Column({
    default: false,
  })
  isPrivate: boolean;

  @Column({
    nullable: true,
    length: 32,
  })
  groupTag: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User, (user) => user.groups)
  owner: User;

  @Column({
    default: true,
  })
  active: boolean;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.group)
  members: GroupMember[];
}
