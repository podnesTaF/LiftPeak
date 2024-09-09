import { Equipment } from 'src/modules/equipment/entities/equipment.entity';
import { ExerciseLog } from 'src/modules/workout-log/entities/exercise-log.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { ExerciseMedia } from './exercise-media.entity';
import { ExerciseTarget } from './exercise-target.entity';
import { Instruction } from './instruction.entity';

export enum ExerciseType {
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
}

export enum ExerciseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ExerciseMetric {
  time = 'time',
  distance = 'distance',
  reps = 'reps',
}

@Entity()
export class Exercise extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  previewUrl: string;

  @OneToMany(() => ExerciseMedia, (media) => media.exercise)
  mediaFiles: ExerciseMedia[];

  @Column()
  type: ExerciseType;

  @Column()
  level: ExerciseLevel;

  @Column({ nullable: true })
  equipmentId: number;
  @ManyToOne(() => Equipment, (e) => e.exercises, {
    eager: true,
    nullable: true,
  })
  equipment: Equipment;

  @Column({ default: ExerciseMetric.reps })
  metric: ExerciseMetric;

  @OneToMany(() => Instruction, (i) => i.exercise)
  instructions: Instruction[];

  @OneToMany(() => ExerciseTarget, (et) => et.exercise)
  exerciseTargets: ExerciseTarget[];

  @OneToMany(() => ExerciseLog, (el) => el.exercise)
  exerciseLogs: ExerciseLog[];
}
