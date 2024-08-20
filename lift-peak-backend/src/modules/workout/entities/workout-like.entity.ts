import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
@Unique(['workoutId', 'userId'])
export class WorkoutLike extends AbstractEntity {
  @Column({ nullable: false })
  workoutId: number;
  @ManyToOne(() => Workout, (workout) => workout.likes, { nullable: false })
  workout: Workout;

  @Column({ nullable: false })
  userId: number;
  @ManyToOne(() => User, (user) => user.workoutReactions, { nullable: false })
  user: User;
}
