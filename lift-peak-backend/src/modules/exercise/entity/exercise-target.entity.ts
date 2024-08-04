import { Target } from 'src/modules/target/entities/target.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Exercise } from './exercise.entity';

export enum ExerciseTargetPriority {
  PRIMARY = 1,
  SECONDARY = 2,
  TERTIARY = 3,
}

@Entity()
export class ExerciseTarget extends AbstractEntity {
  @Column()
  targetId: number;
  @ManyToOne(() => Target, (target) => target.exerciseTargets)
  target: Target;

  @Column()
  exerciseId: number;
  @ManyToOne(() => Exercise, (exercise) => exercise.exerciseTargets)
  exercise: Exercise;

  @Column()
  priority: ExerciseTargetPriority;
}
