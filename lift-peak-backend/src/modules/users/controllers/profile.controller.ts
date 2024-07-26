import {
  Body,
  Controller,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthenticatedUser, GetUser } from '../decorators/user.decorator';
import { CreateProfileDto } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { ProfileService } from '../services/profile.service';

@Controller('profiles')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Post()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'wallpaper', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  async createProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() body: CreateProfileDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      wallpaper?: Express.Multer.File[];
    },
  ) {
    return this.profileService.create(user, {
      ...body,
      avatar: files.avatar ? files.avatar[0] : null,
      wallpaper: files.wallpaper ? files.wallpaper[0] : null,
    });
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'avatar', maxCount: 1 },
      { name: 'wallpaper', maxCount: 1 },
    ]),
  )
  @UseGuards(JwtAuthGuard)
  async updateProfile(
    @GetUser() user: AuthenticatedUser,
    @Body() body: UpdateProfileDto,
    @UploadedFiles()
    files: {
      avatar?: Express.Multer.File[];
      wallpaper?: Express.Multer.File[];
    },
  ) {
    return this.profileService.updateProfile(user, {
      ...body,
      avatar: files.avatar ? files.avatar[0] : null,
      wallpaper: files.wallpaper ? files.wallpaper[0] : null,
    });
  }
}
