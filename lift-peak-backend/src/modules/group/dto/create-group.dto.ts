import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateGroupDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsString()
  location: string;

  @IsBoolean()
  @IsOptional()
  isPrivate: boolean;

  @IsString()
  @IsOptional()
  groupTag: string;

  @IsString()
  @IsOptional()
  pictureUrl: string;

  @IsString()
  @IsOptional()
  wallpaperUrl: string;
}
