import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Answer } from '../pool/entities/answer.entity';
import { Poll } from '../pool/entities/poll.entity';
import { PollService } from '../pool/poll.service';
import { User } from '../users/entities/user.entity';
import { GroupMemberController } from './controllers/group-member.controller';
import { GroupController } from './controllers/group.controller';
import { PostController } from './controllers/post.controller';
import { GroupMember } from './entities/group-member.entity';
import { GroupPost } from './entities/group-post.entity';
import { Group } from './entities/group.entity';
import { PostContent } from './entities/post-content.entity';
import { GroupMemberService } from './services/group-member.service';
import { GroupService } from './services/group.service';
import { PostService } from './services/post.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Group,
      GroupMember,
      GroupPost,
      PostContent,
      Poll,
      Answer,
      User,
    ]),
  ],
  controllers: [GroupController, GroupMemberController, PostController],
  providers: [
    GroupService,
    FileService,
    GroupMemberService,
    PostService,
    PollService,
  ],
  exports: [GroupMemberService],
})
export class GroupModule {}
