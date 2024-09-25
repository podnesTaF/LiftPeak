import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
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

  async getFollowers(
    userId: number,
    query?: { idOnly?: boolean; name?: string },
  ): Promise<User[]> {
    // Start building the query
    const qb = this.userFollowerRepository
      .createQueryBuilder('userFollower')
      .leftJoinAndSelect('userFollower.follower', 'follower')
      .leftJoinAndSelect('follower.profile', 'followerProfile')
      .where('userFollower.followedId = :userId', { userId });

    // Apply name filtering directly in the query if a name is provided
    if (query?.name) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('followerProfile.firstName LIKE :name', {
            name: `%${query.name}%`,
          })
            .orWhere('followerProfile.lastName LIKE :name', {
              name: `%${query.name}%`,
            })
            .orWhere('follower.username LIKE :name', {
              name: `%${query.name}%`,
            });
        }),
      );
    }

    if (query?.idOnly) {
      qb.select(['userFollower.followerId']);
    }

    const userFollowers = await qb.getMany();

    if (query?.idOnly) {
      return userFollowers.map((userFollower) => {
        const user = new User();
        user.id = userFollower.followerId;
        return user;
      });
    }

    return userFollowers.map((userFollower) => userFollower.follower);
  }

  async getFollowings(
    userId: number,
    query?: { idOnly?: boolean; name?: string },
  ): Promise<User[]> {
    // Start building the query
    const qb = this.userFollowerRepository
      .createQueryBuilder('userFollower')
      .leftJoinAndSelect('userFollower.followed', 'followed')
      .leftJoinAndSelect('followed.profile', 'followedProfile')
      .where('userFollower.followerId = :userId', { userId });

    // Apply name filtering directly in the query if a name is provided
    if (query?.name) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('followedProfile.firstName LIKE :name', {
            name: `%${query.name}%`,
          })
            .orWhere('followedProfile.lastName LIKE :name', {
              name: `%${query.name}%`,
            })
            .orWhere('followed.username LIKE :name', {
              name: `%${query.name}%`,
            });
        }),
      );
    }

    // If only IDs are requested, select only the followedId
    if (query?.idOnly) {
      qb.select(['userFollower.followedId']);
    }

    // Execute the query
    const userFollowings = await qb.getMany();

    // If idOnly is true, map the result to return an array of User objects with only the ID
    if (query?.idOnly) {
      return userFollowings.map((userFollower) => {
        const user = new User();
        user.id = userFollower.followedId;
        return user;
      });
    }

    // Return the full followed users otherwise
    return userFollowings.map((userFollower) => userFollower.followed);
  }
}
