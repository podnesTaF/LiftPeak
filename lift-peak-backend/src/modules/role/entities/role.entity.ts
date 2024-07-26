import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

export enum RoleEnum {
  ADMIN = 'admin',
  USER = 'user',
}

@Entity()
export class Role extends AbstractEntity {
  @Column()
  name: RoleEnum;

  @Column({ type: 'text', nullable: true })
  description?: string;
}
