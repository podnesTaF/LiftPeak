import { IsArray, IsNumber } from 'class-validator';
import { CreateSetDto } from './create-set.dto';

export class CreateExerciseLogDto {
  @IsNumber()
  workoutLogId: number;
  @IsNumber()
  exerciseId: number;

  @IsArray()
  sets: CreateSetDto[];
}
