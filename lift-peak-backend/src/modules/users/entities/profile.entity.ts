import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, OneToOne } from 'typeorm';
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

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  gender: Gender;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  wallpaperUrl: string;

  @Column({ nullable: false })
  userId: number;
  @OneToOne(() => User, (user) => user.profile, {
    nullable: false,
    onDelete: 'SET NULL',
  })
  user: User;
}
