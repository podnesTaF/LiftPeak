import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';
import { SocialMediaLink } from './social-media.entity';
import { User } from './user.entity';

export enum Gender {
  male = 'male',
  female = 'female',
  other = 'other',
}

@Entity()
export class Profile extends AbstractEntity {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ nullable: true, type: 'date' })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true, type: 'enum', enum: Gender })
  gender: Gender;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  wallpaperUrl: string;

  @Column({ type: 'text', nullable: true })
  goal: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  city: string;

  @OneToMany(
    () => SocialMediaLink,
    (socialMediaLink) => socialMediaLink.profile,
    { cascade: true },
  )
  socialMediaLinks: SocialMediaLink[];

  @Column({ nullable: false })
  userId: number;
  @OneToOne(() => User, (user) => user.profile, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  user: User;
}
