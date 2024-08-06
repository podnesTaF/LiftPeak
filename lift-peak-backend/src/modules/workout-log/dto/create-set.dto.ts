import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { SetType } from '../entities/set.entity';

export class CreateSetDto {
  @IsNumber()
  @IsOptional()
  order: number;

  @IsEnum(SetType)
  type: SetType;

  @IsNumber()
  @IsOptional()
  exerciseLogId: number;

  @IsNumber()
  @IsOptional()
  distanceInM: number;

  @IsNumber()
  @IsOptional()
  weight: number;

  @IsNumber()
  @IsOptional()
  timeInS: number;

  @IsNumber()
  @IsOptional()
  reps: number;

  @IsNumber()
  @IsOptional()
  previousSetId: number;

  @IsNumber()
  @IsOptional()
  restInS: number;
}
