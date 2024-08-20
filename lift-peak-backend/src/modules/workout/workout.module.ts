import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { WorkoutLog } from '../workout-log/entities/workout-log.entity';
import { FeedController } from './controllers/feed.controller';
import { WorkoutController } from './controllers/workout.controller';
import { RoutineSave } from './entities/routine-save.entity';
import { WorkoutComment } from './entities/workout-comment.entity';
import { WorkoutLike } from './entities/workout-like.entity';
import { WorkoutMedia } from './entities/workout-media.entity';
import { Workout } from './entities/workout.entity';
import { FeedService } from './services/feed.service';
import { WorkoutService } from './services/workout.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workout,
      WorkoutComment,
      WorkoutLike,
      WorkoutMedia,
      RoutineSave,
      WorkoutLog,
    ]),
  ],
  controllers: [WorkoutController, FeedController],
  providers: [WorkoutService, FileService, FeedService],
})
export class WorkoutModule {}
