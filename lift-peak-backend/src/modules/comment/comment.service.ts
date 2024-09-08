import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { CreateComment } from './dto/create-comment.dto';
import { Comment, CommentType } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
    private readonly notificationService: NotificationService,
  ) {}

  async getWorkoutComments(workoutId: number) {
    return await this.commentRepository.find({
      where: { type: CommentType.WORKOUT_POST, workoutId },
      relations: ['commenter'],
    });
  }

  async leaveComment(
    relatedEntityId: number,
    userId: number,
    dto: CreateComment,
  ) {
    const isWorkoutPost = dto.type === CommentType.WORKOUT_POST;
    const relatedEntityName = isWorkoutPost ? 'workoutId' : 'postId';
    const entityName = relatedEntityName.slice(0, -2);

    const comment = this.commentRepository.create({
      commenterId: userId,
      type: dto.type,
      [relatedEntityName]: relatedEntityId,
      content: dto.content,
    });

    const newComment = await this.commentRepository.save(comment);
    const data = await this.commentRepository.findOne({
      where: { id: newComment.id },
      relations: [`${entityName}.user`],
    });

    const recipientId = data[entityName]?.user?.id as number;

    if (recipientId) {
      try {
        await this.notificationService.createNotification({
          type: isWorkoutPost
            ? NotificationType.comment
            : NotificationType.group_comment,
          senderId: userId,
          recipientId,
          [relatedEntityName]: relatedEntityId,
          commentId: newComment.id,
          message: dto.content,
        });
      } catch (error) {
        console.error('Failed to create notification:', error.message);
      }
    }

    const commentsCount = await this.commentRepository.count({
      where: { [relatedEntityName]: relatedEntityId },
    });

    return { comment: newComment, commentsCount };
  }

  getComments(relatedEntityId: number, type: CommentType) {
    return this.commentRepository.find({
      where: {
        type,
        [type === CommentType.WORKOUT_POST ? 'workoutId' : 'postId']:
          relatedEntityId,
      },
      relations: ['commenter'],
    });
  }
}
