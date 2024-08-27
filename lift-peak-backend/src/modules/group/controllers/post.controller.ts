import { Controller, Post, UseGuards } from '@nestjs/common';
import { GroupAdminGuard } from 'src/modules/auth/guards/group-admin.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { PostService } from '../services/post.service';

@Controller('/groups/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':groupId')
  @UseGuards(GroupAdminGuard)
  createPost(@GetUser() user: AuthenticatedUser) {
    return this.postService.createPost();
  }
}
