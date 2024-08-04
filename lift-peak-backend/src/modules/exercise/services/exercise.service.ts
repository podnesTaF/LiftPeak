import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/modules/file/file.service';
import { Target } from 'src/modules/target/entities/target.entity';
import { DataSource, QueryRunner, Repository } from 'typeorm';
import { CreateExerciseTargetDto } from '../dto/create-exercise-target.dto';
import { CreateExerciseDto } from '../dto/create-exercise.dto';
import { ExerciseMedia } from '../entity/exercise-media.entity';
import { ExerciseTarget } from '../entity/exercise-target.entity';
import { Exercise } from '../entity/exercise.entity';
import { InstructionService } from './instruction.service';

@Injectable()
export class ExerciseService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseMedia)
    private readonly exerciseMediaRepository: Repository<ExerciseMedia>,
    private readonly instructionService: InstructionService,
    private readonly fileService: FileService,
    @InjectRepository(ExerciseTarget)
    private readonly exerciseTargetRepository: Repository<ExerciseTarget>,
    private dataSource: DataSource,
  ) {}

  async createExercise(dto: CreateExerciseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exercise = new Exercise();
      exercise.name = dto.name;
      exercise.type = dto.type;
      exercise.equipment = dto.equipment;
      exercise.level = dto.level;
      exercise.metric = dto.metric;

      const savedExercise = await queryRunner.manager.save(Exercise, exercise);

      if (dto.instructions.length > 0) {
        const instructions = await this.instructionService.createInstructions(
          savedExercise.id,
          dto.instructions,
          queryRunner,
        );

        savedExercise.instructions = instructions;
        await queryRunner.manager.save(Exercise, savedExercise);
      }

      if (dto.exerciseTargets.length > 0) {
        const targets = dto.exerciseTargets.map(async (targetDto) => {
          return await this.addExerciseTarget(
            {
              targetId: targetDto.targetId,
              exerciseId: savedExercise.id,
              priority: targetDto.priority,
            },
            queryRunner,
          );
        });

        savedExercise.exerciseTargets = await Promise.all(targets);
      }

      await queryRunner.commitTransaction();
      return savedExercise;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to create exercise: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  async addExerciseTarget(
    { targetId, exerciseId, priority }: CreateExerciseTargetDto,
    queryRunner?: QueryRunner,
  ) {
    const target = await queryRunner.manager.findOne(Target, {
      where: { id: targetId },
    });

    if (!target) {
      throw new Error('Target not found');
    }
    if (!exerciseId) {
      throw new Error('Exercise not found');
    }

    const exerciseTarget = new ExerciseTarget();
    exerciseTarget.targetId = targetId;
    exerciseTarget.exerciseId = exerciseId;
    exerciseTarget.priority = priority;

    return await queryRunner.manager.save(ExerciseTarget, exerciseTarget);
  }

  async addMedia(
    exerciseId: number,
    files: {
      media?: Express.Multer.File[];
      preview?: Express.Multer.File[];
    },
  ) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const exercise = await queryRunner.manager.findOne(Exercise, {
        where: { id: exerciseId },
      });

      if (!exercise) {
        throw new Error('Exercise not found');
      }

      if (files.preview) {
        exercise.previewUrl = await this.fileService.uploadFileToStorage(
          files.preview[0].originalname,
          `exercises/${exercise.id}/preview`,
          files.preview[0].mimetype,
          files.preview[0].buffer,
          exercise.previewUrl,
        );

        await queryRunner.manager.save(Exercise, exercise);
      }

      if (files.media && files.media.length > 0) {
        const media = files.media.map(async (file) => {
          const exerciseMedia = new ExerciseMedia();
          exerciseMedia.exerciseId = exerciseId;
          exerciseMedia.mediaUrl = await this.fileService.uploadFileToStorage(
            file.originalname,
            `exercises/${exercise.id}/media`,
            file.mimetype,
            file.buffer,
          );

          return await queryRunner.manager.save(ExerciseMedia, exerciseMedia);
        });

        await Promise.all(media);
      }

      await queryRunner.commitTransaction();
      return exercise;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(`Failed to add media to exercise: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }
}
