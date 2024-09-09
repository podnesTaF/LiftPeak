import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  ExerciseLevel,
  ExerciseMetric,
  ExerciseType,
} from '../entity/exercise.entity';
import { CreateExerciseTargetDto } from './create-exercise-target.dto';
import { CreateInstructionDto } from './create-instruction.dto';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsArray()
  exerciseTargets: CreateExerciseTargetDto[];

  @IsOptional()
  @IsArray()
  instructions: CreateInstructionDto[];

  @IsEnum(ExerciseType)
  type: ExerciseType;

  @IsEnum(ExerciseLevel)
  level: ExerciseLevel;

  @IsNumber()
  equipmentId: number;

  @IsEnum(ExerciseMetric)
  metric: ExerciseMetric;
}
