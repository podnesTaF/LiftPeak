import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Workout } from '../../workout/entities/workout.entity';

@Entity()
export class WorkoutLog extends AbstractEntity {
  @Column()
  durationInS: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  startTime: Date;

  @Column({
    nullable: false,
  })
  baseWorkoutId: number;
  @ManyToOne(() => Workout, (workout) => workout.workoutLogs, {
    nullable: false,
  })
  baseWorkout: Workout;

  @Column({
    default: 0,
  })
  totalVolume: number;

  @Column({
    default: 0,
  })
  totalDistanceInM: number;
}
