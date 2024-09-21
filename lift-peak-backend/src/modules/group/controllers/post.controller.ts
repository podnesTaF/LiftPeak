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

  @Post(':id')
  @UseGuards(GroupAdminGuard)
  createPost(
    @Param('id') groupId: number,
    @GetUser() user: AuthenticatedUser,
    @Body() dto: CreatePostDto,
  ) {
    return this.postService.createPost(user.id, groupId, dto);
  }

  @Get(':id')
  @UseGuards(GroupAdminGuard)
  getPost(@Param('id') groupId: number) {
    return this.postService.getGroupFeed(groupId);
  }
}
