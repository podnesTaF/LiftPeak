import { Exercise } from 'src/modules/exercise/entity/exercise.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { GroupPost } from './group-post.entity';

export enum PostContentType {
  TEXT = 'text',
  IMAGE = 'image',
  EXERCISE = 'exercise',
  WORKOUT = 'workout',
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
  @ManyToOne(() => GroupPost, (groupPost) => groupPost.contents)
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
  @ManyToOne(() => Exercise, { nullable: true })
  exercise: Exercise;

  @Column({
    nullable: true,
  })
  workoutId: number;
  @ManyToOne(() => Workout, { nullable: true })
  workout: Workout;
}
