import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutController } from './controllers/workout.controller';
import { RoutineSave } from './entities/routine-save.entity';
import { WorkoutComment } from './entities/workout-comment.entity';
import { WorkoutLike } from './entities/workout-like.entity';
import { WorkoutMedia } from './entities/workout-media.entity';
import { Workout } from './entities/workout.entity';
import { WorkoutService } from './services/workout.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Workout,
      WorkoutComment,
      WorkoutLike,
      WorkoutMedia,
      RoutineSave,
    ]),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
