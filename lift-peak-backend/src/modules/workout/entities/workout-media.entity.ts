import { Media } from 'src/modules/media/entity/media.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class WorkoutMedia extends Media {
  @Column({
    nullable: false,
  })
  workoutId: number;

  @ManyToOne(() => Workout, (workout) => workout.mediaContents, {
    nullable: false,
  })
  workout: Workout;
}
