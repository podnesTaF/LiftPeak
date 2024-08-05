import { IsNumber } from 'class-validator';

export class CreateExerciseLogDto {
  @IsNumber()
  workoutLogId: number;
  @IsNumber()
  exerciseId: number;
}
