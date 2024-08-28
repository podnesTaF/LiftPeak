import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Like, LikeType } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
  ) {}

  async handleLike(
    relatedEntityId: number,
    userId: number,
    type: LikeType,
  ): Promise<{ like: boolean; likesCount: number }> {
    const relatedEntityName =
      type === LikeType.WORKOUT_LIKE ? 'workoutId' : 'postId';
    const existingLike = await this.likeRepository.findOne({
      where: { userId, [relatedEntityName]: relatedEntityId },
    });

    if (existingLike) {
      await this.likeRepository.delete(existingLike.id);
      return {
        like: false,
        likesCount: await this.likeRepository.count({
          where: { [relatedEntityName]: relatedEntityId },
        }),
      };
    }

    await this.likeRepository.save({
      userId,
      [relatedEntityName]: relatedEntityId,
    });

    return {
      like: true,
      likesCount: await this.likeRepository.count({
        where: { [relatedEntityName]: relatedEntityId },
      }),
    };
  }
}
