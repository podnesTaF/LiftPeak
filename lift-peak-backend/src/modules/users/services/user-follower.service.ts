import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserFollower } from '../entities/user-follower.enitity';
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
}