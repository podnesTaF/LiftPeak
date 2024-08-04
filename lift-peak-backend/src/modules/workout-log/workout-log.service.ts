import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../users/decorators/user.decorator';
import { Workout } from '../workout/entities/workout.entity';
import { CreateWorkoutLogDto } from './dto/create-workout-log.dto';
import { WorkoutLog } from './entities/workout-log.entity';

@Injectable()
export class WorkoutLogService {
  constructor(
    @InjectRepository(WorkoutLog)
    private readonly workoutLogRepository: Repository<WorkoutLog>,
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
  ) {}

  async createWorkoutLog(user: AuthenticatedUser, dto: CreateWorkoutLogDto) {
    const workout = await this.workoutRepository.findOne({
      where: { id: dto.workoutId },
      relations: ['user'],
    });

    if (!workout) {
      throw new Error('Workout not found');
    }

    if (workout.user.id !== user.id) {
      throw new Error('You are not allowed to log this workout');
    }

    const workoutLog = new WorkoutLog();
    workoutLog.workout = workout;
    workoutLog.startTime = new Date(dto.startTime);
    workoutLog.durationInS = dto.durationInS || 0;
    workoutLog.totalDistanceInM = dto.totalDistanceInM || 0;
    workoutLog.totalVolume = dto.totalVolume || 0;

    return await this.workoutLogRepository.save(workoutLog);
  }
}
