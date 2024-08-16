import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/modules/file/file.service';
import { AuthenticatedUser } from 'src/modules/users/decorators/user.decorator';
import { WorkoutLog } from 'src/modules/workout-log/entities/workout-log.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { IWorkoutPreview } from '../dto/workout-preview.dto';
import { WorkoutMedia } from '../entities/workout-media.entity';
import { Workout } from '../entities/workout.entity';

@Injectable()
export class WorkoutService {
  constructor(
    @InjectRepository(Workout)
    private readonly workoutRepository: Repository<Workout>,
    @InjectRepository(WorkoutLog)
    private readonly workoutLogRepository: Repository<WorkoutLog>,
    @InjectRepository(WorkoutMedia)
    private readonly mediaContentRepository: Repository<WorkoutMedia>,
    private readonly fileService: FileService,
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

  async getWorkouts(): Promise<Workout[]> {
    return await this.workoutRepository.find({
      relations: ['workoutLog', 'comments', 'likes', 'user', 'mediaContents'],
    });
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
      .leftJoin('workout.user', 'user')
      .leftJoin('user.profile', 'profile')
      .where('workout.isRoutine = :isRoutine', { isRoutine: true })
      .select([
        'workout.id',
        'workout.title',
        'exercise.name',
        'COUNT(sets.id) as setCount',
        'user.id',
        'user.username',
        'profile.avatarUrl',
        'profile.firstName',
        'profile.lastName',
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
            user: {
              id: routine.user_id,
              username: routine.user_username,
              profile: {
                avatarUrl: routine.profile_avatarUrl,
                firstName: routine.profile_firstName,
                lastName: routine.profile_lastName,
              },
            },
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

  async uploadWorkoutMedia(workoutId: number, media: Express.Multer.File[]) {
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId },
    });

    if (!workout) {
      throw new Error('Workout not found');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const file of media) {
        const mediaContent = this.mediaContentRepository.create({
          workoutId: workout.id,
          mediaUrl: await this.fileService.uploadFileToStorage(
            file.originalname,
            `workouts/${workout.id}`,
            file.mimetype,
            file.buffer,
          ),
        });

        await queryRunner.manager.save(WorkoutMedia, mediaContent);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        'Failed to upload media',
        error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
