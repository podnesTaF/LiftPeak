import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class WorkoutComment extends AbstractEntity {
  @Column({ type: 'text' })
  content: string;

  @Column({ nullable: false })
  commenterId: number;
  @ManyToOne(() => User, (user) => user.commentsAsCommenter, {
    nullable: false,
  })
  commenter: User;

  @Column({ nullable: false })
  workoutId: number;
  @ManyToOne(() => Workout, (workout) => workout.comments, { nullable: false })
  workout: Workout;
}
