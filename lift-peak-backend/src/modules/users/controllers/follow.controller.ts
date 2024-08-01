import { Controller, Delete, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../decorators/user.decorator';
import { UserFollowerService } from '../services/user-follower.service';

@Controller('users/follow')
export class FollowController {
  constructor(private readonly userFollowerService: UserFollowerService) {}

  @Post(':id')
  @UseGuards(JwtAuthGuard)
  followUser(@GetUser() user: AuthenticatedUser, @Param('id') id: number) {
    return this.userFollowerService.followUser(id, user.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  unfollowUser(@GetUser() user: AuthenticatedUser, @Param('id') id: number) {
    return this.userFollowerService.unfollowUser(id, user.id);
  }
}
