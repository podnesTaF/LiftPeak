import {
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GroupAdminGuard } from 'src/modules/auth/guards/group-admin.guard';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { MemberRole } from '../entities/group-member.entity';
import { GroupMemberService } from '../services/group-member.service';

@Controller('group/:id/members')
export class GroupMemberController {
  constructor(private readonly groupMemberService: GroupMemberService) {}

  @Get()
  async findAll(
    @Param('id') groupId: string,
    @Query() { count, query }: { count?: number; query?: string },
  ) {
    return this.groupMemberService.findAllMembers({
      groupId: +groupId,
      limit: count,
      query,
    });
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  async getMyMembership(
    @Param('id') groupId: number,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.groupMemberService.getMyMembership(user.id, groupId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async addMember(
    @Param('id') groupId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.groupMemberService.addMember(+groupId, user?.id);
  }

  @Patch(':memberId')
  @UseGuards(GroupAdminGuard)
  async privilegeRole(
    @Param() { groupId, memberId }: { groupId: number; memberId: number },
    @Query('role') role: MemberRole,
  ) {
    return this.groupMemberService.privilegeRole({ groupId, memberId, role });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async leaveGroup(
    @Param('id') groupId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.groupMemberService.leaveGroup(+groupId, user?.id);
  }

  @Delete(':memberId')
  @UseGuards(GroupAdminGuard)
  async removeMember(@Param('memberId') memberId: number) {
    return this.groupMemberService.removeMember(memberId);
  }
}
