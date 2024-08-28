import {
  IsArray,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';

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

  @IsOptional()
  @IsObject()
  paths: { [key: string]: string[] };
}
