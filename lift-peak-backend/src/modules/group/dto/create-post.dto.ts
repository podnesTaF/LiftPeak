import { IsArray } from 'class-validator';
import { CreateContentDto } from './create-content.dto';

export class CreatePostDto {
  @IsArray()
  contents: CreateContentDto[];
}
