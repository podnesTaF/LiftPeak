import { IsArray, IsEnum, IsOptional, IsString } from 'class-validator';
import {
  ExerciseEquipment,
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

  @IsEnum(ExerciseEquipment)
  equipment: ExerciseEquipment;

  @IsEnum(ExerciseMetric)
  metric: ExerciseMetric;
}
