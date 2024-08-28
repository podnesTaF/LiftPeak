import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
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
}
