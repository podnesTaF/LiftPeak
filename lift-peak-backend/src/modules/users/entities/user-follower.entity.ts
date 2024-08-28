import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { User } from './user.entity';

@Entity()
@Unique(['followedId', 'followerId'])
export class UserFollower extends AbstractEntity {
  @Column()
  followedId: number;
  @ManyToOne(() => User, (user) => user.followers)
  followed: User;

  @Column()
  followerId: number;
  @ManyToOne(() => User, (user) => user.following)
  follower: User;
}
