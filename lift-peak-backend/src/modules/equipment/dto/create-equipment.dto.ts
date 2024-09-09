import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ExerciseEquipment } from '../entities/equipment.entity';

export class CreateEquipmentDto {
  @IsEnum(ExerciseEquipment)
  name: ExerciseEquipment;

  @IsOptional()
  @IsString()
  description: string;
}
