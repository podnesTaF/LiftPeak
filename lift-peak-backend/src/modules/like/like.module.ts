import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from '../notification/notification.service';
import { Like } from './entities/like.entity';
import { LikeController } from './like.controller';
import { LikeService } from './like.service';
import { Notification } from '../notification/entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Like, Notification])],
  controllers: [LikeController],
  providers: [LikeService, NotificationService],
})
export class LikeModule {}
