import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateComment } from './dto/create-comment.dto';
import { Comment, CommentType } from './entities/comment.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentRepository: Repository<Comment>,
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
    const relatedEntityName =
      dto.type === CommentType.WORKOUT_POST ? 'workoutId' : 'postId';
    const comment = this.commentRepository.create({
      commenterId: userId,
      type: dto.type,
      [relatedEntityName]: relatedEntityId,
      content: dto.content,
    });

    return {
      comment: await this.commentRepository.save(comment),
      commentsCount: await this.commentRepository.count({
        where: { [relatedEntityName]: relatedEntityId },
      }),
    };
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
