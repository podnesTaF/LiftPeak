import { Role } from 'src/modules/role/entities/role.entity';
import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm';
import { Profile } from './profile.entity';

@Entity()
export class User extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({ nullable: true })
  roleId: number;
  @ManyToOne(() => Role, { eager: true })
  role: Role;

  @OneToOne(() => Profile, (profile) => profile.user, {
    eager: true,
    nullable: true,
  })
  @JoinColumn()
  profile: Profile;
}
