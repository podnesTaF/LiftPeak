import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateWorkoutLogDto } from 'src/modules/workout-log/dto/create-workout-log.dto';

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

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  mediaUrls: string[];

  @IsObject()
  @IsOptional()
  @ValidateNested()
  @Type(() => CreateWorkoutLogDto)
  createLogDto: CreateWorkoutLogDto;
}
