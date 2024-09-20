import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { CreatePollDto } from './dto/create-poll.dto';
import { Answer } from './entities/answer.entity';
import { Poll } from './entities/poll.entity';

@Injectable()
export class PollService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollRepository: Repository<Poll>,
    @InjectRepository(Answer)
    private readonly answerRepository: Repository<Answer>,
  ) {}

  async create(dto: CreatePollDto, queryManager?: EntityManager) {
    const poll = new Poll();
    poll.question = dto.question;
    poll.isAnonymous = dto.isAnonymous;
    poll.multipleAnswer = dto.multipleAnswer;
    poll.answers = await Promise.all(
      dto.answers.map(async (answerDto) => {
        const answer = new Answer();
        answer.name = answerDto.name;
        return queryManager.save(Answer, answer);
      }),
    );

    if (queryManager) {
      return queryManager.save(Poll, poll);
    }

    const savedPoll = await this.pollRepository.save(poll);

    return savedPoll;
  }
}
