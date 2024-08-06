import { IsArray, IsNumber, IsOptional } from 'class-validator';
import { CreateSetDto } from './create-set.dto';

export class CreateExerciseLogDto {
  @IsNumber()
  @IsOptional()
  workoutLogId: number;

  @IsNumber()
  exerciseId: number;

  @IsNumber()
  @IsOptional()
  order: number;

  @IsArray()
  sets: CreateSetDto[];
}
