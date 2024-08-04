import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Workout } from '../../workout/entities/workout.entity';
import { ExerciseLog } from './exercise-log.entity';

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
  @OneToOne(() => Workout, (workout) => workout.workoutLog, {
    nullable: false,
  })
  workout: Workout;

  @Column({
    default: 0,
  })
  totalVolume: number;

  @Column({
    default: 0,
  })
  totalDistanceInM: number;

  @OneToMany(() => ExerciseLog, (exerciseLog) => exerciseLog.workoutLogId)
  exerciseLogs: ExerciseLog[];
}
