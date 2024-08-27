import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { GroupMemberService } from 'src/modules/group/services/group-member.service';
import { JwtAuthGuard } from './jwt-auth.guard';

@Injectable()
export class GroupAdminGuard implements CanActivate {
  constructor(
    private readonly jwtAuthGuard: JwtAuthGuard,
    private readonly groupMemberService: GroupMemberService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isAuthenticated = await this.jwtAuthGuard.canActivate(context);
    if (!isAuthenticated) {
      return false;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;
    const groupId = req.params.groupId;

    const isAdmin = await this.groupMemberService.isUserAdminOfGroup(
      user.id,
      groupId,
    );
    if (!isAdmin) {
      throw new ForbiddenException(
        'You do not have admin rights for this group.',
      );
    }

    return true;
  }
}
