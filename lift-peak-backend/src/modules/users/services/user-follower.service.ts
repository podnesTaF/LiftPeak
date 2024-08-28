import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFollower } from '../entities/user-follower.entity';
import { User } from '../entities/user.entity';

@Injectable()
export class UserFollowerService {
  constructor(
    @InjectRepository(UserFollower)
    private readonly userFollowerRepository: Repository<UserFollower>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async followUser(followedId: number, followerId: number) {
    const followed = await this.userRepository.findOne({
      where: { id: followedId },
    });
    const follower = await this.userRepository.findOne({
      where: { id: followerId },
    });

    const userFollower = new UserFollower();
    userFollower.followed = followed;
    userFollower.follower = follower;

    try {
      return await this.userFollowerRepository.save(userFollower);
    } catch (error) {
      throw new BadRequestException('Already following user');
    }
  }

  async unfollowUser(followedId: number, followerId: number) {
    try {
      return await this.userFollowerRepository.delete({
        followedId,
        followerId,
      });
    } catch (error) {
      throw new BadRequestException('Not following user');
    }
  }

  async getFollowings(
    userId: number,
    query?: { idOnly?: boolean },
  ): Promise<User[]> {
    const userFollowers = await this.userFollowerRepository.find({
      where: { followerId: userId },
      relations: ['followed.profile'],
      select: query?.idOnly ? ['followedId'] : undefined,
    });

    if (query?.idOnly) {
      return userFollowers.map((userFollower) => {
        const user = new User();
        user.id = userFollower.followedId;
        return user;
      });
    }

    return userFollowers.map((userFollower) => userFollower.followed);
  }
}
