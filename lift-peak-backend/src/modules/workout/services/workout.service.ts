import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUser } from 'src/modules/users/decorators/user.decorator';
import { WorkoutLog } from 'src/modules/workout-log/entities/workout-log.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { IWorkoutPreview } from '../dto/workout-preview.dto';
import { Workout } from '../entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(WorkoutLog)
    private readonly workoutLogRepository: Repository<WorkoutLog>,
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async createWorkout(user: AuthenticatedUser, dto: CreateWorkoutDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workout = this.workoutRepository.create({
        userId: user.id,
        title: dto.title ?? 'Untitled Workout',
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
            : dto.isRoutine
              ? null
              : new Date(),
          totalDistanceInM: dto.createLogDto.totalDistanceInM ?? 0,
          totalVolume: dto.createLogDto.totalVolume ?? 0,
        });

        const savedLog = await queryRunner.manager.save(workoutLog);
        savedWorkout.workoutLogId = savedLog.id;
        savedWorkout.workoutLog = savedLog;
        await queryRunner.manager.save(Workout, savedWorkout);
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

  async getRoutineList(): Promise<IWorkoutPreview[]> {
    const routines = await this.workoutRepository
      .createQueryBuilder('workout')
      .leftJoin('workout.workoutLog', 'workoutLog')
      .leftJoin('workoutLog.exerciseLogs', 'exerciseLogs')
      .leftJoin('exerciseLogs.exercise', 'exercise')
      .leftJoin('exerciseLogs.sets', 'sets')
      .where('workout.isRoutine = :isRoutine', { isRoutine: true })
      .select([
        'workout.id',
        'workout.title',
        'exercise.name',
        'COUNT(sets.id) as setCount',
      ])
      .groupBy('workout.id, exercise.name')
      .getRawMany();

    const workoutPreviews: IWorkoutPreview[] = routines.reduce(
      (acc, routine) => {
        const existingRoutine = acc.find(
          (item) => item.id === routine.workout_id,
        );

        if (existingRoutine) {
          existingRoutine.exercises.push(routine.exercise_name);
          existingRoutine.sets += parseInt(routine.setCount, 10);
        } else {
          acc.push({
            id: routine.workout_id,
            title: routine.workout_title,
            exercises: [routine.exercise_name],
            sets: parseInt(routine.setCount, 10),
          });
        }

        return acc;
      },
      [] as IWorkoutPreview[],
    );

    return workoutPreviews;
  }
}
