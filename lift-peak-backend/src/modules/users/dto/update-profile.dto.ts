import { PartialType } from '@nestjs/mapped-types';
import { IsOptional } from 'class-validator';
import { CreateProfileDto } from './create-profile.dto';

export class UpdateProfileDto extends PartialType(CreateProfileDto) {
  @IsOptional()
  avatar?: Express.Multer.File;
  @IsOptional()
  wallpaper?: Express.Multer.File;
}
