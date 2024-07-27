import { AbstractEntity } from 'src/shared/entities/abstract.entity';
import { Column, Entity } from 'typeorm';

export enum MediaType {
  IMAGE = 'image',
  VIDEO = 'video',
}

@Entity()
export class Media extends AbstractEntity {
  @Column({
    nullable: true,
  })
  name: string;

  @Column()
  mediaUrl: string;

  @Column({ default: MediaType.IMAGE })
  mediaType: MediaType;

  @Column({ nullable: true })
  order: number;
}
