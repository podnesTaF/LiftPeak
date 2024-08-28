import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { GroupAdminGuard } from 'src/modules/auth/guards/group-admin.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { CreatePostDto } from '../dto/create-post.dto';
import { PostService } from '../services/post.service';

@Controller('/groups/posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post(':groupId')
  @UseGuards(GroupAdminGuard)
  createPost(
    @Param('groupId') groupId: number,
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.createPost(user.id, groupId, dto);
  }

  @Get(':groupId')
  @UseGuards(GroupAdminGuard)
  getPost(@Param('groupId') groupId: number) {
    return this.postService.getGroupFeed(groupId);
  }
}
