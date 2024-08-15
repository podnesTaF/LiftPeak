import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import { FileService } from 'src/modules/file/file.service';
import { Target } from 'src/modules/target/entities/target.entity';
import { PassThrough } from 'stream';
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

          if (file.mimetype.startsWith('video/')) {
            exerciseMedia.mediaUrl = await this.fileService.uploadFileToStorage(
              file.originalname,
              `exercises/${exercise.id}/media`,
              file.mimetype,
              file.buffer,
            );

            const snapshotBuffer = await this.generateSnapshotFromBuffer(
              file.buffer,
            );

            exerciseMedia.previewUrl =
              await this.fileService.uploadFileToStorage(
                `preview-${file.originalname}.jpeg`,
                `exercises/${exercise.id}/media`,
                'image/jpeg',
                snapshotBuffer,
              );
          } else if (file.mimetype.startsWith('image/')) {
            // Resize image
            const rescaledImageBuffer = await sharp(file.buffer)
              .resize({
                width: 400,
                height: 400,
                fit: 'inside',
              })
              .toBuffer();

            exerciseMedia.mediaUrl = await this.fileService.uploadFileToStorage(
              file.originalname,
              `exercises/${exercise.id}/media`,
              file.mimetype,
              file.buffer,
            );

            exerciseMedia.previewUrl =
              await this.fileService.uploadFileToStorage(
                `preview-${file.originalname}`,
                `exercises/${exercise.id}/media`,
                file.mimetype,
                rescaledImageBuffer,
              );
          }

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

  private async generateSnapshotFromBuffer(
    videoBuffer: Buffer,
  ): Promise<Buffer> {
    return new Promise<Buffer>((resolve, reject) => {
      const videoStream = new PassThrough();
      videoStream.end(videoBuffer);

      const buffers: Uint8Array[] = [];
      const outputStream = new PassThrough();

      outputStream.on('data', (data) => buffers.push(data));
      outputStream.on('end', () => resolve(Buffer.concat(buffers)));
      outputStream.on('error', (err) => reject(err));

      ffmpeg(videoStream)
        .outputOptions('-f', 'image2pipe')
        .output(outputStream)
        .on('error', (err) => reject(err))
        .run();
    });
  }

  async getFullExercise(exerciseId: number) {
    return await this.exerciseRepository.findOne({
      where: { id: exerciseId },
      relations: [
        'instructions',
        'exerciseTargets',
        'exerciseTargets.target',
        'exerciseLogs',
        'mediaFiles',
      ],
    });
  }

  async searchExercises(
    value?: string,
  ): Promise<(Partial<Exercise> & { targetGroup: string[] })[]> {
    const query = this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoin('exercise.exerciseTargets', 'exerciseTargets')
      .leftJoin('exerciseTargets.target', 'target')
      .leftJoin('target.muscles', 'muscles')
      .select([
        'exercise.id',
        'exercise.name',
        'target.name',
        'muscles.name',
        'exercise.type',
        'exercise.equipment',
        'exercise.previewUrl',
        'exerciseTargets.priority',
        'exercise.metric',
      ]);

    if (value) {
      query
        .where('exercise.name LIKE :value', { value: `%${value}%` })
        .orWhere('target.name LIKE :value', { value: `%${value}%` })
        .orWhere('muscles.name LIKE :value', { value: `%${value}%` });
    }

    const exercises = await query.getMany();

    return exercises.map((exercise) => {
      const targetGroup = exercise.exerciseTargets.map((et) => et.target.name);
      delete exercise.exerciseTargets;
      return {
        ...exercise,
        targetGroup,
      };
    });
  }
}
