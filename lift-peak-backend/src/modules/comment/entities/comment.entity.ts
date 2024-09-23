import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum CommentType {
  WORKOUT_POST = 'workout_post',
  GROUP_POST = 'group_post',
}

@Entity()
export class Comment extends AbstractEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: false })
  commenterId: number;
  @ManyToOne(() => User, (user) => user.commentsAsCommenter, {
    nullable: false,
  })
  commenter: User;

  @Column({
    type: 'enum',
    enum: CommentType,
    default: CommentType.WORKOUT_POST,
  })
  type: CommentType;

  @Column({ nullable: true })
  workoutId?: number;
  @ManyToOne(() => Workout, (workout) => workout.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  workout?: Workout;

  @Column({ nullable: true })
  postId?: number;
  @ManyToOne(() => GroupPost, (post) => post.comments, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post?: GroupPost;
}
