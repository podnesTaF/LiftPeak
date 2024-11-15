import { Exercise } from 'src/modules/exercise/entity/exercise.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { Set } from './set.entity';
import { WorkoutLog } from './workout-log.entity';

@Entity()
export class ExerciseLog extends AbstractEntity {
  @Column()
  workoutLogId: number;
  @ManyToOne(() => WorkoutLog, (workoutLog) => workoutLog.exerciseLogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'workoutLogId', referencedColumnName: 'id' })
  workoutLog: WorkoutLog;

  @Column()
  exerciseId: number;
  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseLogs)
  exercise: Exercise;

  @Column({
    nullable: true,
  })
  order: number;

  @OneToMany(() => Set, (set) => set.exerciseLog, { onDelete: 'SET NULL' })
  sets: Set[];
}
