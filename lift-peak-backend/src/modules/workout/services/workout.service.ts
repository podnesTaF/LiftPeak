import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUser } from 'src/modules/users/decorators/user.decorator';
import { WorkoutLog } from 'src/modules/workout-log/entities/workout-log.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { Workout } from '../entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(WorkoutLog)
    private readonly workoutLogRepository: Repository<WorkoutLog>,
    @InjectRepository(Workout)
    private dataSource: DataSource,
  ) {}

  async createWorkout(user: AuthenticatedUser, dto: CreateWorkoutDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workout = this.workoutRepository.create({
        userId: user.id,
        title: dto.title ?? 'Untitled Workout', // Provide default value if title is not provided
        description: dto.description ?? '',
        isRoutine: dto.isRoutine ?? false,
        routineId: dto.routineId ?? null,
      });

      const savedWorkout = await queryRunner.manager.save(Workout, workout);

      if (dto.createLogDto) {
        const workoutLog = this.workoutLogRepository.create({
          baseWorkoutId: savedWorkout.id,
          durationInS: dto.createLogDto.durationInS ?? 0,
          startTime: dto.createLogDto.startTime
            ? new Date(dto.createLogDto.startTime)
            : new Date(),
          totalDistanceInM: dto.createLogDto.totalDistanceInM ?? 0,
          totalVolume: dto.createLogDto.totalVolume ?? 0,
        });

        const savedLog = await queryRunner.manager.save(workoutLog);
        savedWorkout.workoutLog = savedLog;
      }

      await queryRunner.commitTransaction();
      return savedWorkout;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to create workout',
        error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }

  async getWorkout(workoutId: number): Promise<Workout> {
    return await this.workoutRepository.findOne({
      where: { id: workoutId },
      relations: ['workoutLog', 'workoutLog.exerciseLogs.sets'],
    });
  }
}
