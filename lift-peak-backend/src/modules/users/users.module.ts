import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Role } from '../role/entities/role.entity';
import { FollowController } from './controllers/follow.controller';
import { ProfileController } from './controllers/profile.controller';
import { UsersController } from './controllers/users.controller';
import { Profile } from './entities/profile.entity';
import { UserFollower } from './entities/user-follower.enitity';
import { User } from './entities/user.entity';
import { ProfileService } from './services/profile.service';
import { UserFollowerService } from './services/user-follower.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Role, UserFollower])],
  controllers: [UsersController, ProfileController, FollowController],
  providers: [UsersService, FileService, ProfileService, UserFollowerService],
  exports: [UsersService],
})
export class UsersModule {}
