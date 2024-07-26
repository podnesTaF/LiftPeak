import { Module } from '@nestjs/common';
import { FileModule } from '../file/file.module';
import { MediaController } from './media.controller';

@Module({
  imports: [FileModule],
  controllers: [MediaController],
})
export class MediaModule {}
