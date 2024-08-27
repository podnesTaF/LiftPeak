import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupPost } from '../entities/group-post.entity';
import { PostContent } from '../entities/post-content.entity';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(GroupPost)
    private readonly postRepository: Repository<GroupPost>,
    @InjectRepository(PostContent)
    private readonly postContentRepository: Repository<PostContent>,
  ) {}

  async createPost() {}
}
