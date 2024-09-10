import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExerciseTarget } from '../exercise/entity/exercise-target.entity';
import {
  Exercise,
  ExerciseLevel,
  ExerciseType,
} from '../exercise/entity/exercise.entity';
import { GenerateWorkoutDto } from './dto/generate-workout.dto';

@Injectable()
export class ConstructorService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseTarget)
    private readonly exerciseTargetRepository: Repository<ExerciseTarget>,
  ) {}

  async generateWorkout(dto: GenerateWorkoutDto) {
    // Apply filters
    let exercises = await this.filterExercisesByTarget(dto.targetIds);
    7;

    exercises = await this.filterExercisesByEquipment(
      exercises,
      dto.equipmentIds,
    );
    exercises = await this.filterExercisesByLevel(exercises, dto.level);
    exercises = await this.filterExercisesByType(exercises, dto.type);

    // Calculate sets and reps
    const workoutPlan = this.calculateSetsAndReps(
      exercises,
      dto.workoutTimeInSec,
      dto.restBetweenSetsInSec,
    );

    return workoutPlan;
  }

  // Filter exercises based on selected targets
  async filterExercisesByTarget(targetIds: number[]): Promise<Exercise[]> {
    return this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.exerciseTargets', 'exerciseTargets')
      .leftJoinAndSelect('exerciseTargets.target', 'target')
      .where('target.id IN (:...targetIds)', { targetIds })
      .getMany();
  }

  // Filter exercises based on selected equipment
  async filterExercisesByEquipment(
    exercises: Exercise[],
    equipmentIds: number[],
  ): Promise<Exercise[]> {
    return exercises.filter((exercise) =>
      exercise.equipmentId
        ? equipmentIds.includes(exercise.equipmentId)
        : false,
    );
  }

  // Filter exercises by difficulty level
  async filterExercisesByLevel(
    exercises: Exercise[],
    level: ExerciseLevel,
  ): Promise<Exercise[]> {
    if (level === ExerciseLevel.BEGINNER) {
      return exercises.filter((exercise) => exercise.level === level);
    } else if (level === ExerciseLevel.INTERMEDIATE) {
      return exercises.filter(
        (exercise) =>
          exercise.level === level || exercise.level === ExerciseLevel.BEGINNER,
      );
    } else {
      return exercises;
    }
  }

  // Filter exercises by type (strength, cardio, etc.)
  async filterExercisesByType(
    exercises: Exercise[],
    type: ExerciseType,
  ): Promise<Exercise[]> {
    return exercises.filter((exercise) => exercise.type === type);
  }

  // Calculate sets and reps
  private calculateSetsAndReps(
    exercises: Exercise[],
    workoutTimeInSec: number,
    restBetweenSetsInSec: number,
  ): { exercise: Exercise; sets: number; reps: number }[] {
    const totalWorkoutTime = workoutTimeInSec;
    const setTime = 60;
    const restTime = restBetweenSetsInSec || 120;
    const totalTimePerExercise = setTime + restTime;

    // Calculate maximum sets based on total time
    const maxTotalSets = Math.floor(totalWorkoutTime / totalTimePerExercise);

    // Assume primary exercises should get more sets
    const primaryExercises = exercises.slice(
      0,
      Math.ceil(exercises.length * 0.6),
    );
    const secondaryExercises = exercises.slice(
      Math.ceil(exercises.length * 0.4),
    );

    const primarySetCount = Math.floor((maxTotalSets * 2) / 3);
    const secondarySetCount = maxTotalSets - primarySetCount;

    const primarySets = Math.floor(primarySetCount / primaryExercises.length);
    const secondarySets = secondaryExercises.length
      ? Math.floor(secondarySetCount / secondaryExercises.length)
      : 0;

    // Assign sets and reps
    const workoutPlan = [];

    for (const exercise of primaryExercises) {
      workoutPlan.push({
        exercise,
        sets: primarySets,
        reps: this.getRepsForExercise(exercise, 'primary', exercise.level),
      });
    }

    for (const exercise of secondaryExercises) {
      workoutPlan.push({
        exercise,
        sets: secondarySets,
        reps: this.getRepsForExercise(exercise, 'secondary', exercise.level),
      });
    }

    return workoutPlan;
  }

  private getRepsForExercise(
    exercise: Exercise,
    priority: 'primary' | 'secondary',
    level: ExerciseLevel,
  ): number {
    const baseReps = {
      Beginner: 12,
      Intermediate: 10,
      Advanced: 8,
    }[level];

    const priorityModifier = priority === 'primary' ? 1 : 0.8;

    let reps = Math.round(baseReps * priorityModifier);

    if (exercise.type === ExerciseType.CARDIO) {
      reps = Math.max(reps * 2, 20); // Higher reps for cardio exercises
    } else if (
      exercise.type === ExerciseType.STRENGTH &&
      priority === 'primary'
    ) {
      reps = Math.max(reps - 2, 6); // Fewer reps for primary strength exercises
    }

    return reps;
  }
}
