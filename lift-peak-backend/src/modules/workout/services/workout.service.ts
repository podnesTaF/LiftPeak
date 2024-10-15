import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/modules/file/file.service';
import { MediaType } from 'src/modules/media/entity/media.entity';
import { AuthenticatedUser } from 'src/modules/users/decorators/user.decorator';
import { WorkoutLog } from 'src/modules/workout-log/entities/workout-log.entity';
import { DataSource, FindOptionsWhere, Repository } from 'typeorm';
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

      const mediaContents = await this.createWorkoutMediaFiles(
        dto.mediaUrls,
        savedWorkout.id,
      );

      await queryRunner.manager.save(WorkoutMedia, mediaContents);

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

  async getWorkouts(
    userId: number,
    {
      following,
      userId: paramUserId,
    }: { following?: boolean; userId?: number },
  ) {
    const whereClause: FindOptionsWhere<Workout> = { isRoutine: false };

    if (following) {
      whereClause.user = [{ followers: { id: userId } }, { id: userId }];
    }

    if (paramUserId) {
      whereClause.userId = paramUserId;
    }

    const workouts = await this.workoutRepository.find({
      relations: ['workoutLog', 'comments', 'likes', 'user', 'mediaContents'],
      where: whereClause,
      order: { createdAt: 'DESC' },
    });

    return workouts.map((workout) => {
      const { likes, comments, ...rest } = workout;
      return {
        ...rest,
        commentsCount: comments.length,
        liked: likes.some((like) => like.userId === userId),
        likesCount: likes.length,
      };
    });
  }

  async getWorkout(workoutId: number, userId?: number) {
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId },
      relations: [
        'workoutLog',
        'comments',
        'likes',
        'user',
        'mediaContents',
        'workoutLog.exerciseLogs.sets',
        'workoutLog.exerciseLogs.exercise',
        'workoutLog.exerciseLogs.exercise.exerciseTargets',
        'workoutLog.exerciseLogs.exercise.exerciseTargets.target',
        'workoutLog.exerciseLogs.exercise.exerciseTargets.target.muscles',
      ],
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    const { likes, comments, workoutLog, ...rest } = workout;
    return {
      ...rest,
      commentsCount: comments.length,
      liked: likes.some((like) => like.userId === userId),
      likesCount: likes.length,
      workoutLog: {
        ...workoutLog,
        exerciseLogs: this.getExerciseLogsInfo(workoutLog),
      },
    };
  }

  async getRoutineToStart(workoutId: number) {
    const workout = await this.workoutRepository.findOne({
      where: { id: workoutId },
      relations: [
        'workoutLog.exerciseLogs.sets',
        'workoutLog.exerciseLogs.exercise',
        'workoutLog.exerciseLogs.exercise.exerciseTargets',
        'workoutLog.exerciseLogs.exercise.exerciseTargets.target',
        'workoutLog.exerciseLogs.exercise.exerciseTargets.target.muscles',
      ],
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    const exerciseLogs = this.getExerciseLogsInfo(workout.workoutLog);

    return {
      ...workout,
      workoutLog: {
        id: workout.workoutLog.id,
        totalDistanceInM: workout.workoutLog.totalDistanceInM,
        totalVolume: workout.workoutLog.totalVolume,
        exerciseLogs,
      },
    };
  }

  private getExerciseLogsInfo(workoutLog: WorkoutLog) {
    return workoutLog.exerciseLogs.map((exerciseLog) => ({
      id: exerciseLog.id,
      exercise: {
        id: exerciseLog.exercise.id,
        name: exerciseLog.exercise.name,
        previewUrl: exerciseLog.exercise.previewUrl,
        type: exerciseLog.exercise.type,
        equipment: exerciseLog.exercise.equipment,
        metric: exerciseLog.exercise.metric,
      },
      targetGroup: exerciseLog.exercise.exerciseTargets.map((target) => ({
        name: target.target.name,
        muscles: target.target.muscles.map((muscle) => muscle.name),
        priority: target.priority,
      })),
      sets: exerciseLog.sets,
    }));
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

  private async createWorkoutMediaFiles(
    mediaUrls: string[],
    workoutId: number,
  ) {
    const mediaContents = [];
    if (!mediaUrls) return mediaContents;
    for (const mediaUrl of mediaUrls) {
      const isVideo =
        mediaUrl.includes('.mp4') ||
        mediaUrl.includes('.mov') ||
        mediaUrl.includes('.avi') ||
        mediaUrl.includes('.flv');
      const type = isVideo ? MediaType.VIDEO : MediaType.IMAGE;
      const mediaContent = this.mediaContentRepository.create({
        mediaUrl,
        mediaType: type,
        workoutId: workoutId,
      });
      mediaContents.push(mediaContent);
    }
    return mediaContents;
  }
}
