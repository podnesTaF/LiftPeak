import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Role } from '../role/entities/role.entity';
import { FollowController } from './controllers/follow.controller';
import { ProfileController } from './controllers/profile.controller';
import { UsersController } from './controllers/users.controller';
import { Gym } from './entities/gym.entity';
import { Profile } from './entities/profile.entity';
import { SocialMediaLink } from './entities/social-media.entity';
import { UserFollower } from './entities/user-follower.entity';
import { User } from './entities/user.entity';
import { UserGymService } from './services/gym.service';
import { ProfileService } from './services/profile.service';
import { SocialMediaService } from './services/social-media.service';
import { UserFollowerService } from './services/user-follower.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Profile,
      Role,
      UserFollower,
      SocialMediaLink,
      Gym,
    ]),
  ],
  controllers: [UsersController, ProfileController, FollowController],
  providers: [
    UsersService,
    UserGymService,
    FileService,
    ProfileService,
    UserFollowerService,
    SocialMediaService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
