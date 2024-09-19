import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { PostContent } from 'src/modules/group/entities/post-content.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { Answer } from './answer.entity';

@Entity()
export class Poll extends AbstractEntity {
  @Column()
  question: string;

  @OneToMany(() => Answer, (a) => a.poll)
  answers: Answer[];

  @Column({ nullable: true })
  postContentId: number;
  @OneToOne(() => PostContent, (pc) => pc.poll, { onUpdate: 'CASCADE' })
  postContent: GroupPost;

  @Column({ default: false })
  isAnonymous: boolean;

  @Column({ default: false })
  multipleAnswer: boolean;
}
