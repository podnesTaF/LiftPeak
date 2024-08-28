import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileService } from '../file/file.service';
import { WorkoutLog } from '../workout-log/entities/workout-log.entity';
import { WorkoutController } from './controllers/workout.controller';
import { RoutineSave } from './entities/routine-save.entity';
import { WorkoutMedia } from './entities/workout-media.entity';
import { Workout } from './entities/workout.entity';
import { WorkoutService } from './services/workout.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Workout, WorkoutMedia, RoutineSave, WorkoutLog]),
  ],
  controllers: [WorkoutController],
  providers: [WorkoutService, FileService],
})
export class WorkoutModule {}
