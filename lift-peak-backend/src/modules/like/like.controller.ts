import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { LikeType } from './entities/like.entity';
import { LikeService } from './like.service';

@Controller('likes')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post('/workout/:id')
  @UseGuards(JwtAuthGuard)
  async likeWorkout(
    @Param('id') workoutId: number,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.likeService.handleLike(
      workoutId,
      user.id,
      LikeType.WORKOUT_LIKE,
    );
  }

  @Post('/post/:id')
  @UseGuards(JwtAuthGuard)
  async likePost(
    @Param('id') postId: number,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.likeService.handleLike(postId, user.id, LikeType.POST_LIKE);
  }
}
