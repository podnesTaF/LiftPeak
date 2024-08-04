import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { ExerciseMedia } from './exercise-media.entity';
import { ExerciseTarget } from './exercise-target.entity';
import { Instruction } from './instruction.entity';

export enum ExerciseType {
  CARDIO = 'CARDIO',
  STRENGTH = 'STRENGTH',
  FLEXIBILITY = 'FLEXIBILITY',
  BALANCE = 'BALANCE',
}

export enum ExerciseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum ExerciseEquipment {
  BODYWEIGHT = 'BODYWEIGHT',
  DUMBBELL = 'DUMBBELL',
  BARBELL = 'BARBELL',
  KETTLEBELL = 'KETTLEBELL',
  CABLE = 'CABLE',
  MACHINE = 'MACHINE',
  BAND = 'BAND',
  BALL = 'BALL',
}

export enum ExerciseMetric {
  time = 'time',
  weight = 'weight',
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

  @Column()
  equipment: ExerciseEquipment;

  @Column({ default: ExerciseMetric.weight })
  metric: ExerciseMetric;

  @OneToMany(() => Instruction, (i) => i.exercise)
  instructions: Instruction[];

  @OneToMany(() => ExerciseTarget, (et) => et.exercise)
  exerciseTargets: ExerciseTarget[];
}
