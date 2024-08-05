import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

export enum SetType {
  warmup = 'warmup',
  workout = 'workout',
}

@Entity()
export class Set extends AbstractEntity {
  @Column()
  order: number;

  @Column()
  type: SetType;

  @Column()
  exerciseLogId: number;

  @Column({
    nullable: true,
  })
  distanceInM: number;

  @Column({
    nullable: true,
  })
  weight: number;

  @Column({
    nullable: true,
  })
  timeInS: number;

  @Column({
    nullable: true,
  })
  reps: number;

  @Column({
    nullable: true,
  })
  previousSetId: number;
  @ManyToOne(() => Set)
  previousSet: Set;

  @Column({
    nullable: true,
  })
  restInS: number;
}
