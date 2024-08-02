import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/modules/file/file.service';
import { AuthenticatedUser } from 'src/modules/users/decorators/user.decorator';
import { Repository } from 'typeorm';
import { Group } from '../entities/group.entity';

@Injectable()
export class GroupService {
  constructor(
    @InjectRepository(Group)
    private readonly groupRepository: Repository<Group>,
    private readonly fileService: FileService,
  ) {}

  async createGroup(user: AuthenticatedUser, createGroupDto: any) {
    const group = new Group();
    group.name = createGroupDto.name;
    group.ownerId = user.id;
    group.groupTag = createGroupDto.groupTag;
    group.description = createGroupDto.description;
    group.isPrivate = !!createGroupDto.isPrivate;

    return await this.groupRepository.save(group);
  }

  async uploadGroupImage(
    groupId: number,
    image: Express.Multer.File,
    type: 'wallpaper' | 'avatar',
  ) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new BadRequestException('Group not found');
    }

    const imageUrl = await this.fileService.uploadFileToStorage(
      image.originalname,
      `/groups/${group.name.replace(' ', '_')}/${type}`,
      image.mimetype,
      image.buffer,
      type === 'wallpaper' ? group.wallPictureUrl : group.pictureUrl,
    );

    if (type === 'wallpaper') {
      group.wallPictureUrl = imageUrl;
    } else {
      group.pictureUrl = imageUrl;
    }

    return await this.groupRepository.save(group);
  }

  async isOwner(groupId: number, userId: number) {
    const group = await this.groupRepository.findOne({
      where: { id: groupId },
    });

    if (!group) {
      throw new BadRequestException('Group not found');
    }

    return group.ownerId === userId;
  }
}
