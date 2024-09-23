import { Comment } from 'src/modules/comment/entities/comment.entity';
import { PostSeen } from 'src/modules/feed/entity/post-seen.entity';
import { Like } from 'src/modules/like/entities/like.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Group } from './group.entity';
import { PostContent } from './post-content.entity';

@Entity()
export class GroupPost extends AbstractEntity {
  @Column()
  groupId: number;
  @ManyToOne(() => Group, (group) => group.posts, { onDelete: 'CASCADE' })
  group: Group;

  @Column()
  userId: number;
  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @OneToMany(() => PostContent, (content) => content.post)
  contents: PostContent[];

  @OneToMany(() => Comment, (c) => c.post)
  comments: Comment[];

  @OneToMany(() => Like, (c) => c.post)
  likes: Like[];

  @OneToMany(() => PostSeen, (c) => c.post)
  seenByUsers: PostSeen[];
}
