import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class Instruction extends AbstractEntity {
  @Column({ type: 'text' })
  content: string;

  @Column()
  exerciseId: number;

  @ManyToOne(() => Exercise, (e) => e.instructions)
  exercise: Exercise;
}
