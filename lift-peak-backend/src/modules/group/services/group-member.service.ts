import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GroupMember } from '../entities/group-member.entity';
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
    console.log(groupId);
    const groupExists = await this.groupRepository.exists({
      where: { id: groupId },
    });

    if (!groupExists) {
      throw new BadRequestException('Group not found');
    }

    return this.groupMemberRepository.save({ groupId, userId });
  }

  async findAllMembers(groupId: number) {
    return await this.groupMemberRepository.find({
      where: { groupId },
      relations: ['user'],
    });
  }
}
