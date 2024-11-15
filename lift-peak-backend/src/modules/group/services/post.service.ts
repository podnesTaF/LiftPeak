import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Poll } from 'src/modules/pool/entities/poll.entity';
import { PollService } from 'src/modules/pool/poll.service';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateContentDto } from '../dto/create-content.dto';
import { CreatePostDto } from '../dto/create-post.dto';
import { GroupPost } from '../entities/group-post.entity';
import { Group } from '../entities/group.entity';
import { PostContent } from '../entities/post-content.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(GroupPost)
    private readonly postRepository: Repository<GroupPost>,
    @InjectRepository(PostContent)
    private readonly postContentRepository: Repository<PostContent>,
    private dataSource: DataSource,
    private readonly pollService: PollService,
  ) {}

  async createPost(userId: number, groupId: number, dto: CreatePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const group = await queryRunner.manager.findOne(Group, {
      where: { id: groupId },
    });
    if (!group) {
      throw new NotFoundException('Group not found');
    }

    const post = await queryRunner.manager.save(GroupPost, {
      userId: userId,
      groupId: groupId,
      contents: [],
    });

    for (const content of dto.contents) {
      const newContent = await this.createPostContent(
        post.id,
        content,
        queryRunner.manager,
      );
      post.contents.push(newContent);
    }

    await queryRunner.manager.save(GroupPost, post);

    await queryRunner.commitTransaction();

    await queryRunner.release();

    return post;
  }

  async createPostContent(
    postId: number,
    dto: CreateContentDto,
    queryManager?: EntityManager,
  ) {
    let poll: Poll | null = null;
    if (dto.type === 'poll' && dto.poll) {
      poll = await this.pollService.create(dto.poll, queryManager);
    }
    const postContent = this.postContentRepository.create({
      ...dto,
      postId: postId,
      poll,
    });
    if (queryManager) {
      return queryManager.save(PostContent, postContent);
    }
    return this.postContentRepository.save(postContent);
  }

  async getGroupFeed(groupId: number, userId: number) {
    const group = await this.postRepository.find({
      where: { groupId },
      relations: [
        'group',
        'comments',
        'likes',
        'contents.exercise',
        'contents.workout.workoutLog.exerciseLogs.exercise',
        'contents.workout.user.profile',
        'contents.poll.answers.voters',
      ],
    });

    const result = group.map((post) => ({
      ...post,
      contents: post.contents.map((content) => ({
        ...content,
        workoutPreview: content.workout
          ? {
              id: content.workout.id,
              title: content.workout.title,
              user: {
                id: content.workout.user.id,
                username: content.workout.user.username,
                profile: {
                  id: content.workout.user.profile.id,
                  avatarUrl: content.workout.user.profile.avatarUrl,
                  firstName: content.workout.user.profile.firstName,
                  lastName: content.workout.user.profile.lastName,
                },
              },
              exercises: content.workout.workoutLog.exerciseLogs.map(
                (el) => el.exercise.name,
              ),
            }
          : null,
        poll: {
          ...content.poll,
          answers: content.poll?.answers?.map((answer) => ({
            ...answer,
            voters: answer.voters.map((voter) => ({ id: voter.id })),
          })),
          currentUserVoteAnswerId: content.poll?.answers?.find((a) =>
            a.voters?.find((v) => v.id === userId),
          )?.id,
        },
      })),
    }));

    return result;
  }
}
