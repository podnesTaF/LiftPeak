import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToMany, ManyToOne } from 'typeorm';
import { Poll } from './poll.entity';

@Entity()
export class Answer extends AbstractEntity {
  @Column()
  name: string;

  @ManyToOne(() => Poll, (poll) => poll.answers, { onDelete: 'CASCADE' })
  poll: Poll;

  @ManyToMany(() => User, (user) => user.answers, { onDelete: 'CASCADE' })
  voters: User[];
}
