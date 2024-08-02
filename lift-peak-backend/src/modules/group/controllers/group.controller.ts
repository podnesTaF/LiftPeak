import {
  Body,
  Controller,
  Param,
  Post,
  UnauthorizedException,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import {
  AuthenticatedUser,
  GetUser,
} from 'src/modules/users/decorators/user.decorator';
import { CreateGroupDto } from '../dto/create-group.dto';
import { GroupService } from '../services/group.service';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @GetUser() user: AuthenticatedUser,
    @Body() createGroupDto: CreateGroupDto,
  ) {
    return this.groupService.createGroup(user, createGroupDto);
  }

  @Post(':id/upload-image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileFieldsInterceptor([{ name: 'image', maxCount: 1 }]))
  async uploadGroupImage(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { type: 'wallpaper' | 'avatar' },
    @Param('id') groupId: string,
    @UploadedFiles()
    files: {
      image?: Express.Multer.File[];
    },
  ) {
    const isOwner = await this.groupService.isOwner(+groupId, user.id);

    if (!isOwner) {
      throw new UnauthorizedException('You are not the owner of this group');
    }

    return this.groupService.uploadGroupImage(
      +groupId,
      files.image[0],
      dto.type,
    );
  }
}
