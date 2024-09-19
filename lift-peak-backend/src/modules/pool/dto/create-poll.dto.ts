import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateAnswerDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

export class CreatePollDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAnswerDto)
  answers: CreateAnswerDto[];

  @IsBoolean()
  isAnonymous: boolean;

  @IsBoolean()
  multipleAnswer: boolean;
}
