import { IsNumber } from 'class-validator';

export class CreateWorkoutLike {
  @IsNumber()
  workoutId: number;
}
