import { IsString } from 'class-validator';

export class CreateInstructionDto {
  @IsString()
  content: string;
}
