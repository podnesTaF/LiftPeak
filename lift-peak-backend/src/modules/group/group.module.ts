import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { GroupMemberController } from './controllers/group-member.controller';
import { GroupController } from './controllers/group.controller';
import { GroupMember } from './entities/group-member.entity';
import { Group } from './entities/group.entity';
import { GroupMemberService } from './services/group-member.service';
import { GroupService } from './services/group.service';

@Module({
  imports: [TypeOrmModule.forFeature([Group, GroupMember])],
  controllers: [GroupController, GroupMemberController],
  providers: [GroupService, FileService, GroupMemberService],
})
export class GroupModule {}
