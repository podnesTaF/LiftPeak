import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Otp extends AbstractEntity {
  @Column()
  otp: string;

  @Column('text', { nullable: true })
  jwtToken: string;

  @Column({ default: 'auth' })
  purpose: string;

  @Column({ nullable: true })
  email: string;

  @Column('timestamp')
  expiresAt: Date;
}
