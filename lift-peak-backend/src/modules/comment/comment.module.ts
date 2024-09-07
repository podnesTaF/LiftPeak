import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Notification } from '../notification/entities/notification.entity';
import { NotificationService } from '../notification/notification.service';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment } from './entities/comment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, Notification])],
  controllers: [CommentController],
  providers: [CommentService, NotificationService],
})
export class CommentModule {}
