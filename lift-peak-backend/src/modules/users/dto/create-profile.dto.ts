import { IsDateString, IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender } from '../entities/profile.entity';

export class CreateProfileDto {
  @IsString()
  @IsOptional()
  firstName: string;

  @IsString()
  @IsOptional()
  lastName: string;

  @IsDateString()
  @IsOptional()
  dateOfBirth?: Date;

  @IsString()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @IsString()
  @IsOptional()
  avatarUrl?: string;

  @IsString()
  @IsOptional()
  wallpaperUrl?: string;
}

export class ProfileWithImages extends CreateProfileDto {
  @IsOptional()
  avatar?: Express.Multer.File;
  @IsOptional()
  wallpaper?: Express.Multer.File;
}
