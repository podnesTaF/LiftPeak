import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Exercise,
  ExerciseEquipment,
  ExerciseMetric,
  ExerciseType,
} from 'src/modules/exercise/entity/exercise.entity';
import { EntityManager, Repository } from 'typeorm';
import { CreateSetDto } from '../dto/create-set.dto';
import { ExerciseLog } from '../entities/exercise-log.entity';
import { Set } from '../entities/set.entity';

@Injectable()
export class SetService {
  constructor(
    @InjectRepository(Set)
    private readonly setRepository: Repository<Set>,
    @InjectRepository(ExerciseLog)
    private readonly exerciseLogRepository: Repository<ExerciseLog>,
  ) {}

  async createSet(dto: CreateSetDto, manager: EntityManager): Promise<Set> {
    const exerciseLog = await manager.findOne(ExerciseLog, {
      where: { id: dto.exerciseLogId },
      relations: ['sets', 'exercise'],
    });

    if (!exerciseLog) {
      throw new Error('Exercise log not found');
    }

    const set = new Set();
    set.order = dto.order || exerciseLog.sets.length + 1;
    set.previousSet =
      (await this.getPreviousSet(
        exerciseLog.exercise.id,
        set.order,
        manager,
      )) || null;
    set.restInS = dto.restInS || 0;
    set.type = dto.type;
    set.exerciseLogId = dto.exerciseLogId;

    this.defineNecessaryMetrics(set, dto, exerciseLog.exercise);

    return await manager.save(set);
  }

  defineNecessaryMetrics(set: Set, dto: CreateSetDto, exercise: Exercise) {
    switch (exercise.type) {
      case ExerciseType.STRENGTH:
        if (
          exercise.metric === ExerciseMetric.reps &&
          exercise.equipment === ExerciseEquipment.BODYWEIGHT
        ) {
          set.reps = dto.reps;
        } else if (exercise.metric === ExerciseMetric.reps) {
          set.reps = dto.reps;
          set.weight = dto.weight;
        } else break;
      case ExerciseType.CARDIO:
        if (exercise.metric === ExerciseMetric.time) {
          set.distanceInM = dto.distanceInM;
          set.timeInS = dto.timeInS;
        } else if (exercise.metric === ExerciseMetric.reps) {
          set.reps = dto.reps;
          set.timeInS = dto.timeInS;
        }
        break;
      case ExerciseType.FLEXIBILITY:
      case ExerciseType.BALANCE:
        if (exercise.metric === ExerciseMetric.time) {
          set.timeInS = dto.timeInS;
        } else if (exercise.metric === ExerciseMetric.reps) {
          set.reps = dto.reps;
        }
        break;
      default:
        throw new Error('Unsupported exercise type');
    }
  }

  getPreviousSet(exerciseId: number, order: number, manager: EntityManager) {
    return manager.findOne(Set, {
      where: {
        exerciseLog: { exercise: { id: exerciseId } },
        order: order,
      },
    });
  }
}
