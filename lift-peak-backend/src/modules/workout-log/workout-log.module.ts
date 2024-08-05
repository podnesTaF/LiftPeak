import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from '../workout/entities/workout.entity';
import { WorkoutLogController } from './controllers/workout-log.controller';
import { ExerciseLog } from './entities/exercise-log.entity';
import { WorkoutLog } from './entities/workout-log.entity';
import { WorkoutLogService } from './services/workout-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutLog, Workout, ExerciseLog])],
  controllers: [WorkoutLogController],
  providers: [WorkoutLogService],
})
export class WorkoutLogModule {}
