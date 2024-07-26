import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { Role } from '../role/entities/role.entity';
import { ProfileController } from './controllers/profile.controller';
import { UsersController } from './controllers/users.controller';
import { Profile } from './entities/profile.entity';
import { User } from './entities/user.entity';
import { ProfileService } from './services/profile.service';
import { UsersService } from './services/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Profile, Role])],
  controllers: [UsersController, ProfileController],
  providers: [UsersService, FileService, ProfileService],
  exports: [UsersService],
})
export class UsersModule {}
