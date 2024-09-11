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
import { WorkoutGenerator } from './workout-generator';

@Injectable()
export class ConstructorService {
  constructor(
    @InjectRepository(Exercise)
    private readonly exerciseRepository: Repository<Exercise>,
    @InjectRepository(ExerciseTarget)
    private readonly exerciseTargetRepository: Repository<ExerciseTarget>,
  ) {}

  async generateWorkout(dto: GenerateWorkoutDto) {
    // Step 1: Apply Filters based on targets, equipment, and type
    let exercises = await this.filterExercisesByTarget(dto.targetIds);
    exercises = await this.filterExercisesByEquipment(
      exercises,
      dto.equipmentIds,
    );
    exercises = await this.filterExercisesByType(exercises, dto.type);
    exercises = await this.filterExercisesByLevel(exercises, dto.level);

    const workoutGenerator = new WorkoutGenerator();

    // Step 3: Use WorkoutGenerator to calculate sets and rest times
    const workoutPlan = workoutGenerator.calculateSetsAndRestTimes(
      exercises,
      dto.workoutTimeInSec,
      dto.restBetweenSetsInSec || 90,
    );

    return workoutPlan;
  }

  // Step 1: Filter exercises based on selected targets
  async filterExercisesByTarget(targetIds: number[]): Promise<Exercise[]> {
    return this.exerciseRepository
      .createQueryBuilder('exercise')
      .leftJoinAndSelect('exercise.exerciseTargets', 'exerciseTargets')
      .leftJoinAndSelect('exerciseTargets.target', 'target')
      .where('target.id IN (:...targetIds)', { targetIds })
      .getMany();
  }

  // Step 2: Filter exercises based on selected equipment
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

  // Step 3: Filter exercises by type (strength, cardio, etc.)
  async filterExercisesByType(
    exercises: Exercise[],
    type: ExerciseType,
  ): Promise<Exercise[]> {
    return exercises.filter((exercise) => exercise.type === type);
  }

  // Step 4: Filter exercises by level
  async filterExercisesByLevel(
    exercises: Exercise[],
    level: ExerciseLevel,
  ): Promise<Exercise[]> {
    if (level === ExerciseLevel.BEGINNER) {
      return exercises.filter((exercise) => exercise.level === level);
    }
    if (level === ExerciseLevel.INTERMEDIATE) {
      return exercises.filter(
        (exercise) =>
          exercise.level === level || exercise.level === ExerciseLevel.BEGINNER,
      );
    }
    if (level === ExerciseLevel.ADVANCED) {
      return exercises;
    }
  }
}
