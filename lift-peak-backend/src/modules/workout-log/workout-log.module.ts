import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Workout } from '../workout/entities/workout.entity';
import { WorkoutLogController } from './controllers/workout-log.controller';
import { ExerciseLog } from './entities/exercise-log.entity';
import { Set } from './entities/set.entity';
import { WorkoutLog } from './entities/workout-log.entity';
import { ExerciseLogService } from './services/exercise-log.service';
import { SetService } from './services/set.service';
import { WorkoutLogService } from './services/workout-log.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkoutLog, Workout, ExerciseLog, Set])],
  controllers: [WorkoutLogController],
  providers: [WorkoutLogService, ExerciseLogService, SetService],
})
export class WorkoutLogModule {}
