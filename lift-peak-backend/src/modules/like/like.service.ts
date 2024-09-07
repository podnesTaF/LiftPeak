import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotificationType } from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { Like, LikeType } from './entities/like.entity';

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like)
    private readonly likeRepository: Repository<Like>,
    private readonly notificationService: NotificationService,
  ) {}

  async handleLike(
    relatedEntityId: number,
    userId: number,
    type: LikeType,
  ): Promise<{ like: boolean; likesCount: number }> {
    const relatedEntityName: any =
      type === LikeType.WORKOUT_LIKE ? 'workoutId' : 'postId';

    const entityName = relatedEntityName.slice(0, -2);

    const existingLike = await this.likeRepository.findOne({
      where: { userId, [relatedEntityName]: relatedEntityId },
      relations: [`${entityName}.user`],
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

    const like = await this.likeRepository.save({
      userId,
      [relatedEntityName]: relatedEntityId,
    });

    const newLike = await this.likeRepository.findOne({
      where: { id: like.id },
      relations: [`${entityName}.user`],
    });
    try {
      // Create a notification
      await this.notificationService.createNotification({
        type:
          type === LikeType.WORKOUT_LIKE
            ? NotificationType.like
            : NotificationType.group_like,
        senderId: userId,
        recipientId: newLike[entityName]?.user?.id as number,
        [relatedEntityName]: relatedEntityId,
      });
    } catch (e) {
      console.log('error sending notification', e.message);
    }

    return {
      like: true,
      likesCount: await this.likeRepository.count({
        where: { [relatedEntityName]: relatedEntityId },
      }),
    };
  }
}
