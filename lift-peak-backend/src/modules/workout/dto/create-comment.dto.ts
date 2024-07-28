import { IsNumber, IsString } from 'class-validator';

export class CreateWorkoutComment {
  @IsNumber()
  workoutId: number;

  @IsString()
  content: string;
}
