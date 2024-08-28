import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

export enum SocialMediaPlatform {
  Twitter = 'Twitter',
  Facebook = 'Facebook',
  Instagram = 'Instagram',
}

@Entity()
export class SocialMediaLink {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Profile, (profile) => profile.socialMediaLinks, {
    eager: true,
  })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;

  @Column()
  platform: SocialMediaPlatform;

  @Column()
  url: string;
}
