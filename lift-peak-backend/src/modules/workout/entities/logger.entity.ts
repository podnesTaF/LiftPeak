import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Workout } from './workout.entity';

@Entity()
export class Logger extends AbstractEntity {
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
  @ManyToOne(() => Workout, (workout) => workout.loggers, { nullable: false })
  baseWorkout: Workout;

  @Column({
    default: 0,
  })
  totalVolume: number;

  @Column({
    default: 0,
  })
  totalDistanceInM: number;
}
