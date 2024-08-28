import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
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
    TypeOrmModule.forFeature([Group, GroupMember, GroupPost, PostContent]),
  ],
  controllers: [GroupController, GroupMemberController, PostController],
  providers: [GroupService, FileService, GroupMemberService, PostService],
  exports: [GroupMemberService],
})
export class GroupModule {}
