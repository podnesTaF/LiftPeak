import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Workout } from '../../workout/entities/workout.entity';

export enum LikeType {
  WORKOUT_LIKE = 'workout_like',
  POST_LIKE = 'post_like',
}

@Entity()
export class Like extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: LikeType,
    default: LikeType.WORKOUT_LIKE,
  })
  type: LikeType;

  @Column({ nullable: true })
  workoutId: number;
  @ManyToOne(() => Workout, (workout) => workout.likes, { nullable: false })
  workout: Workout;

  @Column({ nullable: true })
  postId: number;
  @ManyToOne(() => GroupPost, (post) => post.likes, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: GroupPost;

  @Column({ nullable: false })
  userId: number;
  @ManyToOne(() => User, (user) => user.workoutReactions, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  user: User;
}
