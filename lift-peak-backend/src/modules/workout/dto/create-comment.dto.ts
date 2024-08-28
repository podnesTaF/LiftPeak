import { IsString } from 'class-validator';

export class CreateWorkoutComment {
  @IsString()
  content: string;
}
