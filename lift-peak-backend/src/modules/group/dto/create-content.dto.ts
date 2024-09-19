import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreatePollDto } from 'src/modules/pool/dto/create-poll.dto';
import { PostContentType, TextType } from '../entities/post-content.entity';

export class CreateContentDto {
  @IsEnum(PostContentType)
  type: PostContentType;

  @IsString()
  @IsOptional()
  content: string;

  @IsNumber()
  @IsOptional()
  postId: number;

  @IsEnum(TextType)
  @IsOptional()
  textType: TextType;

  @IsString()
  @IsOptional()
  imageUrl: string;

  @IsNumber()
  @IsOptional()
  exerciseId: number;

  @IsNumber()
  @IsOptional()
  workoutId: number;

  @IsObject()
  @Type(() => CreatePollDto)
  @IsOptional()
  poll?: CreatePollDto;
}
