import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from '../entities/profile.entity';
import {
  SocialMediaLink,
  SocialMediaPlatform,
} from '../entities/social-media.entity';
import { User } from '../entities/user.entity';

const ALLOWED_SOCIAL_MEDIA_PLATFORMS = {
  Twitter: /^https:\/\/(www\.)?twitter\.com\/[A-Za-z0-9_]+$/,
  Facebook: /^https:\/\/(www\.)?facebook\.com\/[A-Za-z0-9.]+$/,
  Instagram: /^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9_.]+$/,
  Snapchat: /^https:\/\/(www\.)?snapchat\.com\/add\/[A-Za-z0-9._]+$/,
};

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectRepository(SocialMediaLink)
    private socialMediaLinkRepository: Repository<SocialMediaLink>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
  ) {}

  validateSocialMediaLink(platform: string, url: string): boolean {
    const regex = ALLOWED_SOCIAL_MEDIA_PLATFORMS[platform];
    return regex ? regex.test(url) : false;
  }

  async addSocialMediaLink(
    userId: number,
    platform: SocialMediaPlatform,
    url: string,
  ): Promise<SocialMediaLink> {
    if (!this.validateSocialMediaLink(platform, url)) {
      throw new BadRequestException('Invalid social media link');
    }

    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profile'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const socialMediaLink = this.socialMediaLinkRepository.create({
      profile: user.profile,
      platform,
      url,
    });

    return this.socialMediaLinkRepository.save(socialMediaLink);
  }
}
