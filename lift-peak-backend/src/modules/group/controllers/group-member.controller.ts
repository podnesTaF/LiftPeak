import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
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

  @Post()
  @UseGuards(JwtAuthGuard)
  async addMember(
    @Param('id') groupId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.groupMemberService.addMember(+groupId, user?.id);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async removeMember(
    @Param('id') groupId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.groupMemberService.removeMember(+groupId, user?.id);
  }
}
