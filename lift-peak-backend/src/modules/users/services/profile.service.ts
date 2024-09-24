import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileService } from 'src/modules/file/file.service';
import { FilePrefix } from 'src/shared/enums/filePrefix';
import { Repository } from 'typeorm';
import { AuthenticatedUser } from '../decorators/user.decorator';
import { ProfileWithImages } from '../dto/create-profile.dto';
import { UpdateProfileDto } from '../dto/update-profile.dto';
import { Profile } from '../entities/profile.entity';
import { User } from '../entities/user.entity';
import { SocialMediaService } from './social-media.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private fileService: FileService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly socialMediaService: SocialMediaService,
  ) {}

  async create(
    user: AuthenticatedUser,
    dto: ProfileWithImages,
  ): Promise<Profile> {
    const { avatar, wallpaper, ...profileData } = dto;

    const profileExists = await this.profileRepository.exists({
      where: { userId: user.id },
    });

    if (profileExists) {
      throw new ForbiddenException('Profile already exists');
    }

    const profile = await this.profileRepository.save({
      ...profileData,
      userId: user.id,
    });

    await this.userRepository.update(user.id, { profile: { id: profile.id } });

    profile.avatarUrl = await this.setProfileImages(
      avatar,
      `${FilePrefix.avatars}/${user.username}`,
    );
    profile.wallpaperUrl = await this.setProfileImages(
      wallpaper,
      `${FilePrefix.wallpapers}/${user.username}`,
    );

    return await this.profileRepository.save(profile);
  }

  async setProfileImages(
    file: Express.Multer.File,
    prefix: string,
    previousUrl?: string,
  ): Promise<string> {
    const imageUrl = await this.fileService.uploadFileToStorage(
      file.originalname,
      `/${prefix}`,
      file.mimetype,
      file.buffer,
      previousUrl,
    );

    return imageUrl;
  }

  async updateProfile(
    authUser: AuthenticatedUser,
    dto: Profile & UpdateProfileDto,
  ): Promise<Profile> {
    const { username, profile } = await this.userRepository.findOne({
      where: { id: authUser.id },
      relations: ['profile.socialMediaLinks'],
    });

    if (!profile) {
      return await this.create(authUser, dto as ProfileWithImages);
    }

    if (!profile) {
      throw new NotFoundException('Profile not found');
    }

    profile.wallpaperUrl =
      dto.wallpaperUrl === undefined ? profile.wallpaperUrl : dto.wallpaperUrl;
    profile.avatarUrl =
      dto.avatarUrl === undefined ? profile.avatarUrl : dto.avatarUrl;

    if (dto.avatar) {
      profile.avatarUrl = await this.setProfileImages(
        dto.avatar,
        `${FilePrefix.avatars}/${username}`,
        profile.avatarUrl,
      );
    } else if (dto.avatarUrl === null) {
      profile.avatarUrl = null;
    }

    if (dto.wallpaper) {
      profile.wallpaperUrl = await this.setProfileImages(
        dto.wallpaper,
        `${FilePrefix.wallpapers}/${username}`,
        profile.wallpaperUrl,
      );
    } else if (dto.wallpaperUrl === null) {
      profile.wallpaperUrl = null;
    }

    if (dto.socialMediaLinks) {
      profile.socialMediaLinks = [];
      await this.profileRepository.save(profile);
      for (let i = 0; i < dto.socialMediaLinks.length; i++) {
        if (!dto.socialMediaLinks[i].profile) {
          const link = await this.socialMediaService.addSocialMediaLink(
            authUser.id,
            dto.socialMediaLinks[i].platform,
            dto.socialMediaLinks[i].url,
          );
          profile.socialMediaLinks.push(link);
        } else {
          profile.socialMediaLinks.push(dto.socialMediaLinks[i]);
        }
      }
    }

    profile.firstName = dto.firstName ?? profile.firstName;
    profile.lastName = dto.lastName ?? profile.lastName;
    profile.dateOfBirth =
      dto.dateOfBirth === undefined ? profile.dateOfBirth : dto.dateOfBirth;
    profile.phoneNumber = dto.phoneNumber ?? profile.phoneNumber;
    profile.gender = dto.gender === undefined ? profile.gender : dto.gender;
    profile.goal = dto.goal ?? profile.goal;

    return this.profileRepository.save(profile);
  }

  async search({ value }: { value: string }): Promise<Profile[]> {
    if (!value) {
      return [];
    }

    return await this.profileRepository
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .distinct(true)
      .where('profile.firstName LIKE :value', { value: `%${value}%` })
      .orWhere('profile.lastName LIKE :value', { value: `%${value}%` })
      .orWhere('user.username LIKE :value', { value: `%${value}%` })
      .getMany();
  }
}
