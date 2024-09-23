import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Answer } from './entities/answer.entity';
import { Poll } from './entities/poll.entity';
import { PollController } from './poll.controller';
import { PollService } from './poll.service';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, Answer, User])],
  controllers: [PollController],
  providers: [PollService],
  exports: [PollService],
})
export class PollModule {}
