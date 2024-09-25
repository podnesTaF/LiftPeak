import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../decorators/user.decorator';
import { UserFollowerService } from '../services/user-follower.service';

@Controller('users')
export class FollowController {
  constructor(private readonly userFollowerService: UserFollowerService) {}

  @Post('/follow/:id')
  @UseGuards(JwtAuthGuard)
  followUser(@GetUser() user: AuthenticatedUser, @Param('id') id: number) {
    return this.userFollowerService.followUser(id, user.id);
  }

  @Delete('/unfollow/:id')
  @UseGuards(JwtAuthGuard)
  unfollowUser(@GetUser() user: AuthenticatedUser, @Param('id') id: number) {
    return this.userFollowerService.unfollowUser(id, user.id);
  }

  @Get('/me/followings')
  @UseGuards(JwtAuthGuard)
  getFollowings(
    @GetUser() user: AuthenticatedUser,
    @Query() query?: { idOnly?: boolean },
  ) {
    return this.userFollowerService.getFollowings(user.id, query);
  }

  @Get('/:id/people')
  async getUserCommunityInfo(
    @Param('id') userId: number,
    @Query() { type, name }: { name: string; type: 'following' | 'followers' },
  ) {
    if (type === 'following') {
      return this.userFollowerService.getFollowings(userId, { name });
    } else {
      return this.userFollowerService.getFollowers(userId, { name });
    }
  }
}
