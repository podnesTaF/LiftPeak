import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Target extends AbstractEntity {
  @Column()
  name: string;

  @Column({ nullable: true, type: 'text' })
  description: string;

  @OneToMany(() => Target, (target) => target.parent)
  muscles: Target[];

  @Column({ nullable: true })
  parentId: number;

  @ManyToOne(() => Target, (target) => target.muscles)
  parent: Target;
}
