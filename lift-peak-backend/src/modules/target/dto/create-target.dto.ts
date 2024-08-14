import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTargetDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  formalName: string;

  @IsOptional()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  muscles: CreateTargetDto[];

  @IsOptional()
  @IsNumber()
  parentId: number;
}
