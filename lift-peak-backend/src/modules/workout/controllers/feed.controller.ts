import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { CreateWorkoutComment } from '../dto/create-comment.dto';
import { FeedService } from '../services/feed.service';

@Controller('/workouts/feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('/:id/comments')
  @UseGuards(JwtAuthGuard)
  async getWorkoutComments(@Param('id') workoutId: number) {
    return await this.feedService.getWorkoutComments(workoutId);
  }

  @Post('/:id/comment')
  @UseGuards(JwtAuthGuard)
  async leaveComment(
    @GetUser() user: AuthenticatedUser,
    @Param('id') workoutId: number,
    @Body() dto: CreateWorkoutComment,
  ) {
    return await this.feedService.leaveComment(user.id, workoutId, dto);
  }

  @Post('/:id/react')
  async handleLikeWorkout(
    @GetUser() user: AuthenticatedUser,
    @Param('id') workoutId: number,
  ) {
    return await this.feedService.handleLikeWorkout(user.id, workoutId);
  }
}
