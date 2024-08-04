import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateWorkoutLogDto {
  @IsNumber()
  workoutId: number;

  @IsNumber()
  durationInS: number;

  @IsOptional()
  @IsDateString()
  startTime: string;

  @IsNumber()
  totalVolume: number;

  @IsOptional()
  @IsNumber()
  totalDistanceInM: number;
}
