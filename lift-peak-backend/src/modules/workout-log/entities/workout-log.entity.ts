import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { Workout } from '../../workout/entities/workout.entity';
import { ExerciseLog } from './exercise-log.entity';

@Entity()
export class WorkoutLog extends AbstractEntity {
  @Column({
    nullable: true,
  })
  durationInS: number;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    nullable: true,
  })
  startTime: Date;

  @Column({
    nullable: false,
  })
  baseWorkoutId: number;
  @OneToOne(() => Workout, (workout) => workout.workoutLog, {
    nullable: false,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    name: 'baseWorkoutId',
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

  @OneToMany(() => ExerciseLog, (exerciseLog) => exerciseLog.workoutLog)
  exerciseLogs: ExerciseLog[];
}
