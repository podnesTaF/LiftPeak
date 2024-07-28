import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isRoutine: boolean;

  @IsNumber()
  @IsOptional()
  routineId: number;
}
