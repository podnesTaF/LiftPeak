import { IsEnum, IsString } from 'class-validator';
import { CommentType } from '../entities/comment.entity';

export class CreateComment {
  @IsString()
  content: string;

  @IsEnum(CommentType)
  type: CommentType;
}
