import { BadRequestException, Injectable } from '@nestjs/common';
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

    let savedPoll: Poll;
    if (queryManager) {
      savedPoll = await queryManager.save(Poll, poll);
    } else {
      savedPoll = await this.pollRepository.save(poll);
    }

    savedPoll.answers = await Promise.all(
      dto.answers.map(async (answerDto) => {
        const answer = new Answer();
        answer.name = answerDto.name;
        answer.pollId = savedPoll.id;
        return queryManager.save(Answer, answer);
      }),
    );

    if (queryManager) {
      return queryManager.save(Poll, savedPoll);
    }

    return await this.pollRepository.save(savedPoll);
  }

  async voteForAnswer(userId: number, answerId: number) {
    // Fetch the answer along with its voters
    console.log(userId);
    const answer = await this.answerRepository.findOne({
      where: { id: answerId },
      relations: ['voters'],
    });

    if (!answer) {
      throw new BadRequestException('Specified wrong answer id');
    }

    // Fetch the poll associated with the answer
    const poll = await this.pollRepository.findOne({
      where: { id: answer.pollId },
      relations: ['answers.voters'],
      select: {
        id: true,
        multipleAnswer: true,
        answers: {
          id: true,
        },
      },
    });

    if (!poll) {
      throw new BadRequestException('Poll not found');
    }

    console.log(userId, poll);

    // Check if the user has already voted in this poll
    this.checkIfUserHasVoted(userId, poll);

    // Check if the user has already voted for this specific answer
    const hasVoted = answer.voters.some((voter) => voter.id === userId);

    if (hasVoted) {
      throw new BadRequestException('User has already voted for this answer');
    }

    // Fetch the user
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException('User not found');
    }

    // Add the user to the voters list
    answer.voters.push(user);

    // Save the updated answer with the new voter
    await this.answerRepository.save(answer);

    return {
      votedId: answerId,
      totalNumberOfVotes: answer.voters.length,
    };
  }

  private checkIfUserHasVoted(userId: number, poll: Poll) {
    const userHasVotedInPoll = poll.answers.some((ans) =>
      ans.voters.some((voter) => voter.id === userId),
    );

    if (userHasVotedInPoll && !poll.multipleAnswer) {
      throw new BadRequestException(
        'User has already voted for another answer in this poll',
      );
    }
  }
}
