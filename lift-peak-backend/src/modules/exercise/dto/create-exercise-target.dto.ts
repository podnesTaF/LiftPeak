import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ExerciseTargetPriority } from '../entity/exercise-target.entity';

export class CreateExerciseTargetDto {
  @IsNumber()
  targetId: number;
  @IsOptional()
  @IsNumber()
  exerciseId: number;
  @IsEnum(ExerciseTargetPriority)
  priority: ExerciseTargetPriority;
}
