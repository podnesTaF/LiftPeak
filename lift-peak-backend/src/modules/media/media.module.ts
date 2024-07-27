import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { Media } from './entity/media.entity';
import { MediaController } from './media.controller';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
})
export class MediaModule {}
