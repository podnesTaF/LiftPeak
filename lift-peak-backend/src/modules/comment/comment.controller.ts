import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { CommentService } from './comment.service';
import { CreateComment } from './dto/create-comment.dto';
import { CommentType } from './entities/comment.entity';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/leave/:id')
  @UseGuards(JwtAuthGuard)
  async leaveComment(
    @GetUser() user: AuthenticatedUser,
    @Param('id') relatedEntityId: number,
    @Body() dto: CreateComment,
  ) {
    return this.commentService.leaveComment(relatedEntityId, user.id, dto);
  }

  @Get('/workout/:id')
  @UseGuards(JwtAuthGuard)
  async getWorkoutComments(@Param('id') workoutId: number) {
    return this.commentService.getComments(workoutId, CommentType.WORKOUT_POST);
  }

  @Get('/post/:id')
  @UseGuards(JwtAuthGuard)
  async getPostComments(@Param('id') postId: number) {
    return this.commentService.getComments(postId, CommentType.GROUP_POST);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  async getComments(
    @Param('id') id: number,
    @Query() { type }: { type: CommentType },
  ) {
    return this.commentService.getComments(id, type);
  }
}
