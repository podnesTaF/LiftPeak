import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @IsString()
  @IsOptional()
  groupTag: string;
}
