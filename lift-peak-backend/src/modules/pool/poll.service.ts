import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
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
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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

  async voteForAnswer(userId: number, answerId: number) {
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['voters'],
    });

    const poll = await this.pollRepository.findOne({
      where: { id: answer.pollId },
      relations: ['answers.voters'],
      select: {
        id: true,
        answers: {
          id: true,
          voters: {
            id: true,
          },
        },
      },
    });

    console.log(poll);

    // if (!answer) {
    //   throw new BadRequestException('Specified wrong answer id');
    // }

    // const user = await this.userRepository.findOne({ where: { id: userId } });

    // // if (answer.voters.some((voter) => voter.id === user.id)) {

    // // } else if(poll.answers.)

    // answer.voters.push(user);

    // await this.answerRepository.save(answer);
    return {
      votedId: answerId,
      totalNumberOfVotes: answer.voters.length,
    };
  }
}
