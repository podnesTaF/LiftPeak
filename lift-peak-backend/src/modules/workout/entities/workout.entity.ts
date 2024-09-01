import { Comment } from 'src/modules/comment/entities/comment.entity';
import { PostSeen } from 'src/modules/feed/entity/post-seen.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Like } from '../../like/entities/like.entity';
import { WorkoutLog } from '../../workout-log/entities/workout-log.entity';
import { RoutineSave } from './routine-save.entity';
import { WorkoutMedia } from './workout-media.entity';

@Entity()
export class Workout extends AbstractEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isRoutine: boolean;

  @Column({ nullable: true })
  routineId: number;

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.workouts, { eager: true })
  user: User;

  @OneToMany(() => WorkoutMedia, (media) => media.workout, { nullable: true })
  mediaContents: WorkoutMedia[];

  @OneToMany(() => Workout, (workout) => workout.routine, { nullable: true })
  workouts: Workout[];

  @ManyToOne(() => Workout, (workout) => workout.routine, { nullable: true })
  routine: Workout;

  @ManyToMany(() => User, (user) => user.routines, { nullable: true })
  routineOfUsers: User[];

  @OneToMany(() => Like, (like) => like.workout)
  likes: Like[];

  @OneToMany(() => PostSeen, (seen) => seen.workout)
  seenByUsers: PostSeen[];

  @OneToMany(() => Comment, (comment) => comment.workout)
  comments: Comment[];

  @OneToMany(() => RoutineSave, (save) => save.workout)
  saves: RoutineSave[];

  @Column({ nullable: true })
  workoutLogId: number;

  @OneToOne(() => WorkoutLog, (log) => log.workout, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'workoutBaseId',
    name: 'workoutLogId',
    referencedColumnName: 'id',
  })
  workoutLog: WorkoutLog;
}
