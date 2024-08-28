import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
    const postContent = this.postContentRepository.create({
      ...dto,
      postId: postId,
    });
    if (queryManager) {
      return queryManager.save(PostContent, postContent);
    }
    return this.postContentRepository.save(postContent);
  }

  async getGroupFeed(groupId: number) {
    const group = await this.postRepository.find({
      where: { groupId },
      relations: ['contents', 'group', 'comments', 'likes'],
    });

    return group;
  }
}
