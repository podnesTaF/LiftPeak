import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateWorkoutLogDto {
  @IsNumber()
  @IsOptional()
  workoutId: number;

  @IsNumber()
  @IsOptional()
  durationInS: number;

  @IsOptional()
  @IsDateString()
  startTime: string;

  @IsNumber()
  @IsOptional()
  totalVolume: number;

  @IsOptional()
  @IsNumber()
  totalDistanceInM: number;
}
