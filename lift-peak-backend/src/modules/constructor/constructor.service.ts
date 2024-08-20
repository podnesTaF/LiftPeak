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
    private readonly exerciseRepository: Promise<Exercise>,
    @InjectRepository(ExerciseTarget)
    private readonly exerciseTargetRepository: Repository<ExerciseTarget>,
  ) {}

  async generateWorkout(dto: GenerateWorkoutDto) {
    // apply filters
  }

  // filters

  async filterExercisesByTarget(targetIds: number[]) {}

  async filterExercisesByEquipment(
    exercises: Exercise[],
    equipmentIds: number[],
  ) {}

  async filterExercisesByLevel(exercises: Exercise[], level: number) {}

  async filterExercisesByType(exercises: Exercise[], type: number) {}

  // calculate sets and reps. Taking into account the workout time and rest between sets and priority of the selected target muscles.

  private calculateSetsAndReps(
    exercises: Exercise[],
    workoutTimeInSec: number,
    restBetweenSetsInSec: number,
  ): { exercise: Exercise; sets: number; reps: number }[] {
    const totalWorkoutTime = workoutTimeInSec;
    const setTime = 60; // Assuming 1 minute per set
    const restTime = restBetweenSetsInSec || 120; // Default rest time
    const totalTimePerExercise = setTime + restTime;

    // Calculate maximum sets based on total time
    const maxTotalSets = Math.floor(totalWorkoutTime / totalTimePerExercise);

    // Assume primary exercises should get more sets
    const primaryExercises = exercises;
    const secondaryExercises = [];

    const primarySetCount = Math.floor((maxTotalSets * 2) / 3);
    const secondarySetCount = maxTotalSets - primarySetCount;

    const primarySets = Math.floor(primarySetCount / primaryExercises.length);
    const secondarySets = Math.floor(
      secondarySetCount / secondaryExercises.length,
    );

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
