import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { GroupMember, MemberRole } from '../entities/group-member.entity';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupMemberService {
  constructor(
    @InjectRepository(GroupMember)
    private readonly groupMemberRepository: Repository<GroupMember>,
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
  ) {}

  async addMember(groupId: number, userId: number) {
    const groupExists = await this.groupRepository.exists({
      where: { id: groupId },
    });

    if (!groupExists) {
      throw new BadRequestException('Group not found');
    }

    return this.groupMemberRepository.save({ groupId, userId });
  }

  async leaveGroup(groupId: number, userId: number) {
    const groupExists = await this.groupRepository.exists({
      where: { id: groupId },
    });

    if (!groupExists) {
      throw new BadRequestException('Group not found');
    }

    return this.groupMemberRepository.delete({ groupId, userId });
  }

  async removeMember(memberId: number) {
    const member = await this.groupMemberRepository.findOneOrFail({
      where: { id: memberId },
    });
    return this.groupMemberRepository.delete({ id: member.id });
  }

  async findAllMembers({
    groupId,
    page = 1,
    limit = 10,
    query,
  }: {
    groupId: number;
    query?: string;
    page?: number;
    limit?: number;
  }) {
    const qb = this.groupMemberRepository
      .createQueryBuilder('groupMember')
      .innerJoinAndSelect('groupMember.user', 'user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('groupMember.groupId = :groupId', { groupId });

    if (query) {
      qb.andWhere(
        new Brackets((qb) => {
          qb.where('user.username LIKE :query', { query: `%${query}%` })
            .orWhere('profile.firstName LIKE :query', { query: `%${query}%` })
            .orWhere('profile.lastName LIKE :query', { query: `%${query}%` });
        }),
      );
    }

    // Apply pagination
    qb.skip((page - 1) * limit).take(limit);

    const [members, membersCount] = await qb.getManyAndCount();

    return {
      data: members,
      count: membersCount,
      totalPages: Math.ceil(membersCount / limit),
      currentPage: page,
    };
  }

  async isUserAdminOfGroup(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
      relations: ['members'],
    });

    if (!group) {
      throw new BadRequestException('Group not found');
    }

    const member = group.members.find((member) => member.userId === +userId);

    if (!member) {
      return false;
    }

    return member.role === MemberRole.ADMIN;
  }

  async getMyMembership(
    userId: number,
    groupId: number,
  ): Promise<GroupMember | null> {
    const member = await this.groupMemberRepository.findOne({
      where: { userId, groupId },
    });

    return member;
  }

  async privilegeRole({
    memberId,
    groupId,
    role,
  }: {
    memberId: number;
    groupId: number;
    role: MemberRole;
  }) {
    const member = await this.groupMemberRepository.findOne({
      where: { id: memberId, groupId: groupId },
    });

    if (!member) {
      throw new Error(
        `Member with ID ${memberId} in group ${groupId} not found`,
      );
    }

    member.role = role;

    return await this.groupMemberRepository.save(member);
  }
}
