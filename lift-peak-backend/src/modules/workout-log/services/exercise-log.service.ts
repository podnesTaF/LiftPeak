import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticatedUser } from 'src/modules/users/decorators/user.decorator';
import { DataSource, Repository } from 'typeorm';
import { CreateExerciseLogDto } from '../dto/create-exercise-log.dto';
import { ExerciseLog } from '../entities/exercise-log.entity';
import { WorkoutLog } from '../entities/workout-log.entity';
import { SetService } from './set.service';

@Injectable()
export class ExerciseLogService {
  constructor(
    @InjectRepository(ExerciseLog)
    private readonly exerciseLogRepository: Repository<ExerciseLog>,
    @InjectRepository(WorkoutLog)
    private readonly workoutLogRepository: Repository<WorkoutLog>,
    private readonly setService: SetService,
    private dataSource: DataSource,
  ) {}

  async addWorkoutExercises(
    user: AuthenticatedUser,
    workoutLogId: number,
    dto: CreateExerciseLogDto[],
  ) {
    // Create a new transaction to ensure that all operations are atomic
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const workoutLog = await queryRunner.manager.findOne(WorkoutLog, {
        where: { id: workoutLogId },
      });

      if (!workoutLog) {
        throw new NotFoundException('Workout log not found');
      }

      const exerciseLogs = [];

      let order = 1;
      for (const exerciseDto of dto) {
        const exerciseLog = this.exerciseLogRepository.create({
          workoutLogId: workoutLog.id,
          exerciseId: exerciseDto.exerciseId,
          order: exerciseDto.order || order++,
        });
        const savedExerciseLog = await queryRunner.manager.save(exerciseLog);
        for (const setDto of exerciseDto.sets) {
          setDto.exerciseLogId = savedExerciseLog.id;
          await this.setService.createSet(setDto, queryRunner.manager);
        }

        exerciseLogs.push(savedExerciseLog);
      }

      await queryRunner.commitTransaction();
      return exerciseLogs;
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to create exercise log',
        error.message,
      );
    } finally {
      await queryRunner.release();
    }
  }
}
