import { Exercise } from 'src/modules/exercise/entity/exercise.entity';
import { Poll } from 'src/modules/pool/entities/poll.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { GroupPost } from './group-post.entity';

export enum PostContentType {
  TEXT = 'text',
  IMAGE = 'image',
  EXERCISE = 'exercise',
  WORKOUT = 'workout',
  POLL = 'poll',
}

export enum TextType {
  TEXT = 'text',
  SUBTITLE = 'subtitle',
  TITLE = 'title',
}

@Entity()
export class PostContent extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: PostContentType,
  })
  type: PostContentType;

  @Column({
    type: 'text',
    nullable: true,
  })
  content: string;

  @Column()
  postId: number;
  @ManyToOne(() => GroupPost, (groupPost) => groupPost.contents, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: GroupPost;

  @Column({
    type: 'enum',
    enum: TextType,
    nullable: true,
  })
  textType: TextType;

  @Column({
    nullable: true,
  })
  imageUrl: string;

  @Column({
    nullable: true,
  })
  exerciseId: number;
  @ManyToOne(() => Exercise, { nullable: true, onDelete: 'SET NULL' })
  exercise: Exercise;

  @Column({
    nullable: true,
  })
  workoutId: number;
  @ManyToOne(() => Workout, { nullable: true, onDelete: 'SET NULL' })
  workout: Workout;

  @Column({
    nullable: true,
  })
  pollId: number;
  @OneToOne(() => Poll, (poll) => poll.postContent, { onDelete: 'SET NULL' })
  @JoinColumn()
  poll: Poll;
}
