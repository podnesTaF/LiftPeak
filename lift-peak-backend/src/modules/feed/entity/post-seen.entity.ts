import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

export enum PostType {
  WORKOUT = 'workout',
  GROUP = 'group',
}

@Entity()
export class PostSeen {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.seenPosts)
  user: User;

  @Column({ type: 'enum', enum: PostType })
  postType: PostType;

  @Column({
    nullable: true,
  })
  postId: number;
  @ManyToOne(() => GroupPost, (post) => post.seenByUsers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  post: GroupPost;

  @Column({
    nullable: true,
  })
  workoutId: number;
  @ManyToOne(() => Workout, (post) => post.seenByUsers, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  workout: Workout;

  @Column({ default: 0 })
  seenCount: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  seenAt: Date;
}
