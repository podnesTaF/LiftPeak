import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModule } from '../file/file.module';
import { FileService } from '../file/file.service';
import { Media } from './entity/media.entity';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';

@Module({
  imports: [FileModule, TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, FileService],
})
export class MediaModule {}
