import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseLog } from '../entities/exercise-log.entity';
import { WorkoutLog } from '../entities/workout-log.entity';

@Injectable()
export class ExerciseLogService {
  constructor(
    @InjectRepository(ExerciseLog)
    private readonly exerciseLogRepository: Repository<ExerciseLog>,
    @InjectRepository(WorkoutLog)
    private readonly workoutLogRepository: Repository<WorkoutLog>,
  ) {}

  async addExerciseLog() {}
}
