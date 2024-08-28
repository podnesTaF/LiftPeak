import { ExerciseTarget } from 'src/modules/exercise/entity/exercise-target.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

export enum BodySide {
  front = 'front',
  back = 'back',
}

@Entity()
export class Target extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  formalName: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @OneToMany(() => Target, (target) => target.parent)
  muscles: Target[];

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Target, (target) => target.muscles, { onDelete: 'CASCADE' })
  parent: Target;

  @Column({ type: 'json', nullable: true })
  paths: { [key: string]: string[] };

  @OneToMany(() => ExerciseTarget, (et) => et.target)
  exerciseTargets: ExerciseTarget[];
}
