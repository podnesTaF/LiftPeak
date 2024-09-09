import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import ffmpeg from 'fluent-ffmpeg';
import sharp from 'sharp';
import { Equipment } from 'src/modules/equipment/entities/equipment.entity';
import { FileService } from 'src/modules/file/file.service';
import { MediaType } from 'src/modules/media/entity/media.entity';
import { Target } from 'src/modules/target/entities/target.entity';
import { ExerciseLog } from 'src/modules/workout-log/entities/exercise-log.entity';
import { Set } from 'src/modules/workout-log/entities/set.entity';
import { PassThrough } from 'stream';
import { Brackets, DataSource, QueryRunner, Repository } from 'typeorm';
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
    @InjectRepository(ExerciseLog)
    private readonly exerciseLogRepository: Repository<ExerciseLog>,
    @InjectRepository(ExerciseMedia)
    private readonly exerciseMediaRepository: Repository<ExerciseMedia>,
    private readonly instructionService: InstructionService,
    private readonly fileService: FileService,
    @InjectRepository(ExerciseTarget)
    private readonly exerciseTargetRepository: Repository<ExerciseTarget>,
    @InjectRepository(Equipment)
    private readonly equipmentRepository: Repository<Equipment>,
    private dataSource: DataSource,
  ) {}

  async createExercise(dto: CreateExerciseDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const equipment = await this.equipmentRepository.findOne({
      where: { id: dto.equipmentId },
    });

    if (!equipment) {
      throw new BadRequestException('Equipment not found');
    }

    try {
      const exercise = new Exercise();
      exercise.name = dto.name;
      exercise.type = dto.type;
      exercise.level = dto.level;
      exercise.equipment = equipment;
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
        const media = files.media.map(async (file, index) => {
          const exerciseMedia = new ExerciseMedia();
          exerciseMedia.order = index + 1;
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

            exerciseMedia.mediaType = MediaType.VIDEO;
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

            exerciseMedia.mediaType = MediaType.IMAGE;
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

  // async searchExercises(
  //   value?: string,
  //   id?: number,
  // ): Promise<(Partial<Exercise> & { targetGroup: string[] })[]> {
  //   const query = this.exerciseRepository
  //     .createQueryBuilder('exercise')
  //     .leftJoin('exercise.exerciseTargets', 'exerciseTargets')
  //     .leftJoin('exerciseTargets.target', 'target')
  //     .leftJoin('target.muscles', 'muscles')
  //     .select([
  //       'exercise.id',
  //       'exercise.name',
  //       'target.name',
  //       'muscles.name',
  //       'exercise.type',
  //       'exercise.equipment',
  //       'exercise.previewUrl',
  //       'exerciseTargets.priority',
  //       'exercise.metric',
  //     ]);

  //   if (value) {
  //     query
  //       .where('exercise.name LIKE :value', { value: `%${value}%` })
  //       .orWhere('target.name LIKE :value', { value: `%${value}%` })
  //       .orWhere('muscles.name LIKE :value', { value: `%${value}%` });
  //   }
  //   if (id) {
  //     query.andWhere('exercise.id = :id', { id });
  //   }

  //   const exercisesWithSets = this.withPreviousSets(await query.getMany());

  //   return this.toShortTargetFormat(exercisesWithSets);
  // }

  async searchExercises({
    value,
    id,
    userId,
    muscleIds,
  }: {
    value?: string;
    id?: number;
    userId?: number;
    muscleIds?: number[];
  }) {
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

    if (muscleIds && muscleIds.length) {
      query.andWhere(
        new Brackets((qb) => {
          qb.where('target.id IN (:...muscleIds)', { muscleIds }).orWhere(
            'muscles.id IN (:...muscleIds)',
            { muscleIds },
          );
        }),
      );
    }

    if (id) {
      query.andWhere('exercise.id = :id', { id });
    }

    const exercises = this.toShortTargetFormat(await query.getMany());

    return Promise.all(
      exercises.map(async (exercise) => ({
        ...exercise,
        previousSets: await this.getPreviousSets(exercise.id, userId),
      })),
    );
  }

  async getPreviousSets(exerciseId: number, userId: number): Promise<Set[]> {
    // Fetch only the necessary fields, filtering directly in the query
    const exerciseLogs = await this.exerciseLogRepository
      .createQueryBuilder('exerciseLog')
      .leftJoinAndSelect('exerciseLog.sets', 'sets')
      .innerJoin('exerciseLog.workoutLog', 'workoutLog')
      .innerJoin('workoutLog.workout', 'workout')
      .where('exerciseLog.exerciseId = :exerciseId', { exerciseId })
      .andWhere('workout.userId = :userId', { userId })
      .orderBy('exerciseLog.createdAt', 'DESC')
      .addOrderBy('sets.order', 'ASC')
      .select([
        'exerciseLog.id',
        'sets.id',
        'sets.order',
        'sets.weight',
        'sets.reps',
        'sets.distanceInM',
        'sets.timeInS',
        'sets.restInS',
        'sets.type',
      ])
      .getMany();

    const prevSets: Set[] = [];

    for (const log of exerciseLogs) {
      for (const set of log.sets) {
        if (!prevSets.some((existingSet) => existingSet.order === set.order)) {
          prevSets.push(set);
        }
      }

      if (prevSets.length >= log.sets.length) {
        break;
      }
    }
    prevSets.sort((a, b) => a.order - b.order);

    return prevSets;
  }

  async getAlternativeExercises(
    exerciseId: number,
    shortForm: boolean = false,
  ) {
    const exercises = await this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoin('exercise.exerciseTargets', 'exerciseTargets')
      .leftJoin('exerciseTargets.target', 'target')
      .where('exercise.id != :id', { id: exerciseId })
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('et.targetId')
          .from(ExerciseTarget, 'et')
          .where('et.exerciseId = :exerciseId')
          .setParameter('exerciseId', exerciseId)
          .getQuery();
        return 'target.id IN ' + subQuery;
      })
      .andWhere('exercise.type = (SELECT type FROM exercise WHERE id = :id)', {
        id: exerciseId,
      })
      .andWhere(
        'exercise.level = (SELECT level FROM exercise WHERE id = :id)',
        { id: exerciseId },
      )
      .andWhere(
        new Brackets((qb) => {
          qb.where(
            'exercise.equipment = (SELECT equipment FROM exercise WHERE id = :id)',
            { id: exerciseId },
          ).orWhere(
            '(:exerciseId IN (SELECT ex.id FROM exercise ex WHERE ex.equipment IN (:...alternateEquipment)))',
            {
              exerciseId: exerciseId,
              alternateEquipment: ['MACHINE', 'BODYWEIGHT'],
            },
          );
        }),
      )
      .orderBy('exerciseTargets.priority', 'ASC')
      .addOrderBy('exercise.name', 'ASC')
      .select([
        'exercise.id',
        'exercise.name',
        'exercise.type',
        'exercise.equipment',
        'exercise.level',
        'exercise.previewUrl',
        'exerciseTargets.priority',
        'target.name',
      ])
      .getMany();

    if (shortForm) {
      return this.toShortTargetFormat(exercises);
    } else {
      return exercises;
    }
  }

  private toShortTargetFormat(exercises: Exercise[]) {
    return exercises.map((exercise) => {
      const targetGroup = exercise.exerciseTargets
        .filter((et) => et.priority === 1)
        .map((et) => et.target.name);
      delete exercise.exerciseTargets;
      return {
        ...exercise,
        targetGroup,
      };
    });
  }

  async getExerciseLogHistory(id: number) {
    return this.exerciseLogRepository.find({
      where: { exerciseId: id },
      relations: ['sets'],
    });
  }
}
