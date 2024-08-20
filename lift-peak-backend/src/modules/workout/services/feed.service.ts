import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkoutComment } from '../dto/create-comment.dto';
import { WorkoutComment } from '../entities/workout-comment.entity';
import { WorkoutLike } from '../entities/workout-like.entity';
import { Workout } from '../entities/workout.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(WorkoutComment)
    private readonly commentRepository: Repository<WorkoutComment>,
    @InjectRepository(WorkoutLike)
    private readonly likeRepository: Repository<WorkoutLike>,
  ) {}

  async getWorkoutComments(workoutId: number) {
    return await this.commentRepository.find({
      where: { workoutId },
      relations: ['commenter'],
    });
  }

  async leaveComment(
    userId: number,
    workoutId: number,
    dto: CreateWorkoutComment,
  ) {
    const comment = this.commentRepository.create({
      commenterId: userId,
      workoutId: workoutId,
      content: dto.content,
    });

    return {
      comment: await this.commentRepository.save(comment),
      commentsCount: await this.commentRepository.count({
        where: { workoutId },
      }),
    };
  }

  async handleLikeWorkout(
    userId: number,
    workoutId: number,
  ): Promise<{ like: boolean; likesCount: number }> {
    const existingLike = await this.likeRepository.findOne({
      where: { userId, workoutId },
    });

    if (existingLike) {
      await this.likeRepository.delete(existingLike.id);
      return {
        like: false,
        likesCount: await this.likeRepository.count({ where: { workoutId } }),
      };
    }

    await this.likeRepository.save({
      userId,
      workoutId,
    });

    return {
      like: true,
      likesCount: await this.likeRepository.count({ where: { workoutId } }),
    };
  }
}
