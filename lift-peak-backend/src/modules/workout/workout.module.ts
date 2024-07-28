import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkoutController } from './controllers/workout.controller';
import { WorkoutComment } from './entities/workout-comment.entity';
import { WorkoutLike } from './entities/workout-like.entity';
import { Workout } from './entities/workout.entity';
import { WorkoutService } from './services/workout.service';

@Module({
  imports: [TypeOrmModule.forFeature([Workout, WorkoutComment, WorkoutLike])],
  controllers: [WorkoutController],
  providers: [WorkoutService],
})
export class WorkoutModule {}
