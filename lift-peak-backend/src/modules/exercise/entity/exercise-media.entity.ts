import { Media } from 'src/modules/media/entity/media.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Exercise } from './exercise.entity';

@Entity()
export class ExerciseMedia extends Media {
  @Column()
  exerciseId: number;
  @ManyToOne(() => Exercise, (exercise) => exercise.mediaFiles)
  exercise: Exercise;

  @Column()
  previewUrl: string;
}
