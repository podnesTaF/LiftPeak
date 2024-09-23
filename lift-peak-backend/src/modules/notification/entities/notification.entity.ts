import { Comment } from 'src/modules/comment/entities/comment.entity';
import { GroupPost } from 'src/modules/group/entities/group-post.entity';
import { Group } from 'src/modules/group/entities/group.entity';
import { User } from 'src/modules/users/entities/user.entity';
import { Workout } from 'src/modules/workout/entities/workout.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

export enum NotificationType {
  follow = 'follow',
  like = 'like',
  challenge = 'challenge',
  routine = 'routine',
  comment = 'comment',
  group_follow = 'follow_like',
  group_like = 'group_like',
  group_comment = 'group_comment',
}

@Entity()
export class Notification extends AbstractEntity {
  @Column({ type: 'enum', enum: NotificationType })
  type: NotificationType;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ nullable: true })
  senderId: number;

  @ManyToOne(() => User, (user) => user.sentNotifications, {
    eager: true,
    nullable: true,
  })
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @Column()
  recipientId: number;
  @ManyToOne(() => User, (user) => user.receivedNotifications, { eager: true })
  @JoinColumn({ name: 'recipientId' })
  recipient: User;

  // Optional: relation to post for notifications like 'group_like', 'group_comment', etc.
  @ManyToOne(() => GroupPost, {
    nullable: true,
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'postId' })
  post: GroupPost;

  @Column({ nullable: true })
  postId: number;

  // Optional: relation to workout post for notifications like 'like', 'comment', or "routine" .
  @ManyToOne(() => Workout, { nullable: true, eager: true })
  @JoinColumn({ name: 'workoutId' })
  workout: Workout;

  @Column({ nullable: true })
  workoutId: number;

  // Optional: relation to comment for comment-related notifications
  @ManyToOne(() => Comment, { nullable: true, eager: true })
  @JoinColumn({ name: 'commentId' })
  comment: Comment;

  @Column({ nullable: true })
  commentId: number;

  // Optional: relation to group for group-related notifications
  @ManyToOne(() => Group, { nullable: true, eager: true })
  @JoinColumn({ name: 'groupId' })
  group: Group;

  @Column({ nullable: true })
  groupId: number;

  @Column({ nullable: true })
  message: string;
}
