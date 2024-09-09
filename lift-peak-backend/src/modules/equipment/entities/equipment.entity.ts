import { Exercise } from 'src/modules/exercise/entity/exercise.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany } from 'typeorm';

export enum ExerciseEquipment {
  BODYWEIGHT = 'bodyweight',
  DUMBBELLS = 'bumbbells',
  BARBELL = 'barbell',
  KETTLEBELL = 'kettlebell',
  MACHINE = 'machine',
  BAND = 'resistance band',
  BALL = 'ball',
}

@Entity()
export class Equipment extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: ExerciseEquipment,
  })
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @Column({ nullable: true })
  iconUrl: string;

  @Column({ nullable: true })
  imageUrl: string;

  @OneToMany(() => Exercise, (e) => e.equipment)
  exercises: Exercise[];
}
