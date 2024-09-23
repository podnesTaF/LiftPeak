import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../users/decorators/user.decorator';
import { PollService } from './poll.service';

@Controller('polls')
export class PollController {
  constructor(private readonly pollService: PollService) {}

  @Post('/vote')
  @UseGuards(JwtAuthGuard)
  async vote(
    @Body() { answerId }: { answerId: number },
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.pollService.voteForAnswer(user.id, answerId);
  }
}
