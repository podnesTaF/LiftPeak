import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Workout extends AbstractEntity {
  @Column({ type: 'text' })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ default: false })
  isRoutine: boolean;

  @Column({ nullable: true })
  routineId: number;

  @OneToMany(() => Workout, (workout) => workout.routine, { nullable: true })
  workouts: Workout[];

  @ManyToOne(() => Workout, (workout) => workout.routine, { nullable: true })
  routine: Workout;

  @ManyToMany(() => User, (user) => user.routines, { nullable: true })
  routineOfUsers: User[];
}
