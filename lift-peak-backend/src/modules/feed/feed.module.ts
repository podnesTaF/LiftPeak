import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostSeen } from './entity/post-seen.entity';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [TypeOrmModule.forFeature([PostSeen])],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
