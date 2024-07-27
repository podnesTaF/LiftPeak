import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateLoggerDto {
  @IsNumber()
  durationInS: number;

  @IsDateString()
  startTime: Date;

  @IsNumber()
  @IsOptional()
  baseWorkoutId: number;

  @IsNumber()
  @IsOptional()
  totalVolume: number;

  @IsNumber()
  @IsOptional()
  totalDistanceInM: number;
}
