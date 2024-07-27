import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class RoutineSave extends AbstractEntity {
  @Column({ nullable: false })
  userId: number;

  @ManyToOne(() => User, (user) => user.savedRoutines, { nullable: false })
  user: User;

  @Column({ nullable: false })
  workoutId: number;
  @ManyToOne(() => Workout, (routine) => routine.saves, { nullable: false })
  workout: Workout;
}
