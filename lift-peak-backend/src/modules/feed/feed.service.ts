import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostSeen, PostType } from './entity/post-seen.entity';

@Injectable()
export class FeedService {
  constructor(
    @InjectRepository(PostSeen)
    private postSeenRepository: Repository<PostSeen>,
  ) {}

  async markPostAsSeen(
    userId: number,
    postId: number,
    postType: PostType,
  ): Promise<void> {
    const relatedEntityName =
      postType === PostType.GROUP ? 'postId' : 'workoutId';

    const postSeen = await this.postSeenRepository.findOne({
      where: { user: { id: userId }, [relatedEntityName]: postId },
    });

    if (postSeen) {
      postSeen.seenAt = new Date();
      postSeen.seenCount += 1;
      await this.postSeenRepository.save(postSeen);
      return;
    }

    await this.postSeenRepository.save({
      user: { id: userId },
      [relatedEntityName]: postId,
      seenCount: 1,
    });
  }
}
