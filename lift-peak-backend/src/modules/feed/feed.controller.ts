import { Controller, Param, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { PostType } from './entity/post-seen.entity';
import { FeedService } from './feed.service';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Post('/mark-post-as-seen/:postId')
  @UseGuards(JwtAuthGuard)
  markPostAsSeen(
    @Param('postId') postId: number,
    @Query('postType') postType: PostType,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.feedService.markPostAsSeen(user.id, postId, postType);
  }
}
