import { IsArray, IsEnum, IsNumber, IsOptional } from 'class-validator';
import {
  ExerciseLevel,
  ExerciseType,
} from 'src/modules/exercise/entity/exercise.entity';

export class GenerateWorkoutDto {
  @IsEnum(ExerciseType)
  type: ExerciseType;

  @IsEnum(ExerciseLevel)
  level: ExerciseLevel;

  @IsArray()
  targetIds: number[];

  @IsArray()
  equipmentIds: number[];

  @IsNumber()
  workoutTimeInSec: number;

  @IsNumber()
  @IsOptional()
  restBetweenSetsInSec: number;
}
